/**
 * Created by fushou on 2019/7/13.
 */

var schedule = require('node-schedule'); // 定时任务
var child_ws_client = require('./child_ws_client');

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('./child_api');
var moment = require('moment');
var child_packet = require('./child_packet');
var child_job_statis = require('./child_job_statis');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

var module_name = 'child_filter_sch';

function onGetUserActiveAppCount(uname, user_actives) {

    for(var idx = 0; idx < user_actives.length; idx++) {
        var itemData = user_actives[idx];

        if (uname == itemData.name) {
            return itemData.count;
        }
    }

    return 0;
}

// onRecordLog : 记录日志
function onRecordLog(user_sessions) {
    for(var idx = 0; idx < user_sessions.length; idx++) {
        var itemUserData = user_sessions[idx];

        var id = itemUserData.id;
        var user_id = itemUserData.user_id;
        var user_name = itemUserData.user_name;
        var weight = itemUserData.weight;
        var last_tm = itemUserData.last_tm;
        var policy_ip_addr = itemUserData.policy_ip_addr;
        var client_ip_addr = itemUserData.client_ip_addr;

        var source = JSON.stringify(__filename);
        var event_tm = util.getFormatCurTime();
        var info = log_info_string.getOverdueInfoString(user_name, client_ip_addr);
        var event = log_constant.getLogEventForceQuitName();
        var status = log_constant.getLogStatusSuccessName();
        var detail = log_detail_string.getDetailString(event_tm, 'child_filter_sch', user_name, event, status);
        var remark = '';

        if (weight == 0) {
            // 管理员日志
            log_api.writeAdminOverdueLog(source, event_tm, user_name, info, detail, remark, function(logErr, logResult){

            })
        }
        else {
            // 普通用户日志
            event = log_constant.getLogEventUserForceQuitName();
            detail = log_detail_string.getDetailString(event_tm, 'child_filter_sch', user_name, event, status);
            log_api.writeUserOverdueLog(source, event_tm, user_name, info, detail, remark, function(logErr, logResult){

            })
        }

    }
}

function onCheckUserTimeout(user_sessions, user_actives, max_timeout) {
    // user_actives: [{"name":"ac004","count":0},{"name":"ac003","count":0},{"name":"test","count":0},{"name":"test1","count":0},{"name":"test2","count":0},{"name":"test3","count":0}]
    if (max_timeout == undefined || max_timeout == null || max_timeout <= 0) {
        max_timeout = 900;
    }

    var ct = moment();

    var timeout_user = [];

    for(var idx = 0; idx < user_sessions.length; idx++) {
        var itemUserData = user_sessions[idx];

        var id = itemUserData.id;
        var user_id = itemUserData.user_id;
        var user_name = itemUserData.user_name;
        var weight = itemUserData.weight;
        var last_tm = itemUserData.last_tm;
        //var policy_ip_addr = itemUserData.policy_ip_addr;
        //var client_ip_addr = itemUserData.client_ip_addr;

        // 计算距最后一次更新的秒数
        var continue_seconds = util.continueSeconds(last_tm);

        if (continue_seconds >= max_timeout && 0 == onGetUserActiveAppCount(user_name, user_actives)) {
            // 超时，并且活动应用个数为0
            timeout_user.push(itemUserData);
        }
    }

    util.printLog(module_name + ' timeout users', timeout_user);

    if (timeout_user.length > 0) {
        var strSql = "UPDATE res_user_session SET status=0 WHERE id IN (";

        for(var j = 0; j < timeout_user.length; j++) {
            var itemData = timeout_user[j];

            if (j > 0) {
                strSql += ",";
            }
            strSql += itemData.id;
        }

        strSql += ")";

        modify_db.modify(strSql, null, function(err, result){
            util.printLog('strSql', strSql);
            util.printLog('result', result);

            if (err) {
                util.printLog(module_name + ' error', err.message);
            }

            // 写日志
            onRecordLog(timeout_user);
        });
    }
}

var obj = {

    user_data: null,

    just_started: 1, // 刚启动标志

    onSetUserData: function(data) {
        this.user_data = data;
    },

    onGetUserData: function() {
        return this.user_data;
    },

    onSend: function(data) {
        process.send(data);
    },

    onFilter: function(res) {
        var that = this;

        var status = 0;

        util.printLog(module_name, res);

        var cmdid = res[json_key.getCmdIdKey()];
        switch(cmdid) {
            case child_packet.getChildInitCmdId(): {
                // 初始化包
                var id = res[json_key.getIdKey()];
                var name = res[json_key.getNameKey()];
                var print_log = res['print_log'];
                var port = res[json_key.getPortKey()];

                var itemData = {
                    id: id,
                    name: name
                }

                that.onSetUserData(itemData);

                var resPacketData = child_packet.getChildInitRespPacket(id, 0, '成功');

                that.onSend(resPacketData);

                // 初始化
                that.onInit(port, print_log);

                status = 1;
            }break;

            case child_packet.getChildExitCmdId() : {
                // 关闭
                util.printLog(module_name, ' process exit.');
                process.exit(0);
            }break;

            default: {
                util.printLog(module_name, 'unknown packet.');
                status = 0;
            }break;
        }

        return status;
    },

    onInit: function(mon_port, print_log) {
        var that = this;

        util.SetMonPort(mon_port);
        util.SetPrintLog(print_log ? true : false);

// 延迟启动websocket客户端
        var sch_timer = setTimeout(function(){
            var host = '127.0.0.1';

            child_ws_client.connect(host, mon_port);
            clearTimeout(sch_timer);
            sch_timer = null;

            util.SetWebClient(child_ws_client);

        }, 1000);

// 启动定时任务
//var times = [1,6,11,16,21,26,31,36,41,46,51,56];
        var times2 = [59];
        var rule = new schedule.RecurrenceRule();
        rule.second = times2; // 每隔5秒执行一次
//rule.minute = times; // 每隔5分钟执行一次
        schedule.scheduleJob(rule, function(){
            // 检测用户是否超时
            that.onUserTimeoutJob();

            // 统计数据
            that.onStatisDataJob();
        });
    },

    // onUserTimeoutJob : 检测过期用户
    onUserTimeoutJob: function() {
        // 获取活动用户信息
        child_api.getUserActive(null, function(err, result){
            var user_actives = [];
            if (err) {
                util.printLog(module_name + ' getUserActive error', err);
            }
            else {
                // result: [{"name":"ac004","count":0},{"name":"ac003","count":0},{"name":"test","count":0},{"name":"test1","count":0},{"name":"test2","count":0},{"name":"test3","count":0}]
                util.printLog(module_name + ' getUserActive result', result);

                user_actives = result;
            }

            // 查询登录用户信息
            var strSql2 = "SELECT id,user_id,user_name,weight,last_tm,policy_ip_addr,client_ip_addr FROM res_user_session WHERE status=1";
            var strSql3 = "SELECT max_timeout FROM cfg_ws LIMIT 1";
            db.query(strSql2, function(err2, result2){
                util.printLog('strSql', strSql2);
                util.printLog('result', result2);
                if (err2) {
                    util.printLog(module_name + ' error', err2);
                }
                else if (result2.length > 0) {
                    var user_sessions = result2;

                    db.query(strSql3, function(err3, result3){
                        util.printLog('strSql', strSql3);
                        util.printLog('result', result3);

                        var max_timeout = 900;
                        if (!err3 && result3.length > 0) {
                            max_timeout = result3[0].max_timeout;
                        }

                        onCheckUserTimeout(user_sessions, user_actives, max_timeout);

                    });

                }
            });

        });
    },

    // 统计数据
    onStatisDataJob: function() {
        var that = this;

        var just_start = that.just_started;

        if (just_start) {
            that.just_started = 0;

            // 日周期统计
            // 对最近N天做统计，统计到昨天
            child_job_statis.onJobStatis(7);

            // 周周期统计
            // 对最近N周做统计，统计到上周，以周日晚上23点59分59秒为界
            child_job_statis.onJobWeekStatis(4);

            // 月周期统计
            // 对最近N月做统计，统计到上月
            child_job_statis.onJobMonthStatis(3);

            // 季度
            child_job_statis.onJobQuarterStatis();

            // 半年统计
            child_job_statis.onJobHalfYearStatis();

            // 年统计
            child_job_statis.onJobYearStatis();
        }
        else {
            var ct = moment();
            var fmt_ct = ct.format('HH:mm:ss'); // YYYY-MM-DD HH:mm:ss
            var fmt_week_day = ct.format('E'); // 计算是周几，周一为1,周二为2......，周日为7

            var fmt_year = ct.get('year'); // ct.year()
            var fmt_month = ct.get('month'); // ct.month();
            var fmt_day = ct.get('date'); // ct.date();
            var fmt_week_day = ct.get('weekday'); // ct.weekday();
            var fmt_hours = ct.get('hours'); // ct.hours()
            var fmt_minutes = ct.get('minutes'); // ct.minutes()
            var fmt_seconds = ct.get('seconds'); // ct.seconds()

            var fmt_is_time_end = (fmt_ct == '23:59:59') ? 1 : 0;

            // 获取当前年月日时分秒 ct.toArray() -> [years, months, date, hours, minutes, seconds, milliseconds]
            // ct.toObject() // {years: xxxx, months: x, date: xx ...}

            var cur_dt_msg = fmt_year + '-' + fmt_month + '-' + fmt_day + ' ' + fmt_hours + ':' + fmt_minutes + ':' + fmt_seconds + '(' + fmt_week_day + ')';
            util.printLog(module_name + ' onStatisDataJob current datetime', cur_dt_msg);

            // 日周期统计，每天晚上23点59分59秒开始统计
            if (fmt_is_time_end) {
                // 对当天做统计
                child_job_statis.onJobStatis(1);
            }

            // 周周期统计，每个周日晚上23点59分59秒开始统计
            if (fmt_week_day == 7 && fmt_is_time_end) {
                // 对当周进行统计
                child_job_statis.onJobWeekStatis(0);
            }

            // 月周期统计，每个月月尾晚上23点59分59秒开始统计
            if (child_job_statis.onCurIsMonthEnd() && fmt_is_time_end) {
                child_job_statis.onJobMonthStatis(0);
            }

            // 季度
            var quarter_month = [3,6,9,12];
            if (quarter_month.includes(fmt_month) && child_job_statis.onCurIsMonthEnd() && fmt_is_time_end) {
                child_job_statis.onJobQuarterStatis();
            }

            // 半年统计
            var half_year_month = [6,12];
            if (half_year_month.includes(fmt_month) && child_job_statis.onCurIsMonthEnd() && fmt_is_time_end) {
                child_job_statis.onJobHalfYearStatis();
            }

            // 年统计
            if (fmt_month == 12 && child_job_statis.onCurIsMonthEnd() && fmt_is_time_end) {
                child_job_statis.onJobYearStatis();
            }
        }
    }

}

module.exports = obj;