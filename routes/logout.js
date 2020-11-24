/**
 * Created by fushou on 2019/5/9.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../common/json_key');
var util = require('../common/util');
var db = require('../database/mysql_db');
var modify_db = require('../database/modify_mysql_db');

var log_api = require('./log/log_api');
var log_constant = require('./log/log_constant');
var log_info_string = require('./log/log_info_string');
var log_detail_string  = require('./log/log_detail_string');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('logout req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var id = req_body.id;
    var name = req_body.name;
    var token = req_body.token;
    if (name == undefined || name==null) {
        name = '';
    }

    if (id <= 0 || token==undefined || token==null || token=='' || token.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误，编号或令牌无效';
        res.send(resData);
        return false;
    }

    var ct = util.getFormatCurTime();
    var client_ip = util.getClientIp(req);

    var remark = '';
    remark += name;
    if (client_ip.length > 0) {
        remark += ' 在远程主机 ' + client_ip;
    }
    remark += " 注销";

    var status = 0;

    var policy_ip_addr = ''; // 清空

    var strSql = "UPDATE res_user_session SET ";
    strSql += "last_tm='" + ct + "',";
    strSql += "status=" + status + ",";
    strSql += "policy_ip_addr='" + policy_ip_addr + "',";
    strSql += "remark='" + remark + "' ";
    strSql += "WHERE user_id=" + id;

    modify_db.modify(strSql, null, function(err, result){
        if (global.print_log) {
            console.log('strSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '注销失败，错误信息：' + err.message;
        }
        else {
            var affs = result[json_key.getAffectedRowsKey()];

            if (affs > 0) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '注销成功';
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '注销失败，未检测到此用户登录信息';
            }
        }

        // log
        var source = JSON.stringify(__filename);
        var event_tm = util.getFormatCurTime();
        var info = log_info_string.getLogoutInfoString(name, client_ip);
        var event = log_constant.getLogEventLogoutName();
        var status = log_constant.getLogStatusSuccessName();
        var detail = log_detail_string.getDetailString(event_tm, 'logout', name, event, status, client_ip);
        var remark = '';

        var strSql2 = "SELECT weight FROM res_user WHERE name='" + name + "'";
        db.query(strSql2, function(err2, result2){
            if (!err2 && result2.length > 0 && (result2[0].weight == 0)) {
                log_api.writeAdminLogoutLog(source, event_tm, name, info, detail, remark, function(logErr, logResult){
                    res.send(resData);
                });
            }
            else {
                event = log_constant.getLogEventUserLogoutName();
                detail = log_detail_string.getDetailString(event_tm, 'logout', name, event, status);
                log_api.writeUserLogoutLog(source, event_tm, name, info, detail, remark, function(logErr, logResult){
                    res.send(resData);
                });
            }
        });

        //res.send(resData);
    })

})

module.exports = router;
