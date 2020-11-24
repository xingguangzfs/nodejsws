/**
 * Created by fushou on 2019/7/24.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('../child/child_api');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

function onNotifyLog(list) {
    for (var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        var type = itemData.type;
        var name = itemData.name;
        var value = itemData.value;

        var auth = '';
        var source = JSON.stringify(__filename);
        var event_tm = util.getFormatCurTime();
        var info = '';
        var event = log_constant.getLogEventModifyName();
        var status = log_constant.getLogStatusSuccessName();
        var target = '';
        var remark = '';
        var level_id = log_constant.getLogLevelWarmId();
        var event_id = log_constant.getLogEventModifyId();

        switch(name) {
            case 'account_admin': {
                target = '管理员权限';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'desktop_deny': {
                target = '禁止桌面模式';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'rdp_port': {
                target = 'RDP端口';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'poll_period': {
                target = '统计数据采集频率';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            default: {
                continue;
            }
        }

        var detail = log_detail_string.getDetailString2(event_tm, 'host_modify', auth, target, event, value, status);

        log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

        });
    }

}

function onNotifyCCModify(list) {

    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        var type = itemData.type;
        var name = itemData.name;
        var value = itemData.value;

        switch(name) {
            case 'account_admin': {
                child_api.changeCfgAsAccountAdmin(value, function(err, result){
                   if (err) {
                       util.printLog('host modify changeCfgAsAccountAdmin err', err);
                   }
                   else {
                       util.printLog('host modify changeCfgAsAccountAdmin', result);
                   }
                });
            }break;

            case 'desktop_deny': {
                child_api.changeCfgAsDesktopDeny(value, function(err, result){
                    if (err) {
                        util.printLog('host modify changeCfgAsDesktopDeny err', err);
                    }
                    else {
                        util.printLog('host modify changeCfgAsDesktopDeny', result);
                    }
                });
            }break;

            case 'rdp_port': {
                // 更新缓存
                util.setRdpPort(value);

                child_api.changeCfgAsRdpPort(value, function(err, result){
                    if (err) {
                        util.printLog('host modify changeCfgAsRdpPort err', err);
                    }
                    else {
                        util.printLog('host modify changeCfgAsRdpPort', result);
                    }
                });
            }break;

            case 'poll_period': {
                child_api.changeCfgAsPollPeriod(value, function(err, result){
                    if (err) {
                        util.printLog('host modify changeCfgAsPollPeriod err', err);
                    }
                    else {
                        util.printLog('host modify changeCfgAsPollPeriod', result);
                    }
                });
            }break;
        }
    }

}

router.post('/', function(req, res, next) {
    var resData = {};

    var req_body = req.body;

    util.printLog('cfg host modify req body', req_body);

    var list = req_body[json_key.getListKey()];

    if (list == undefined || list == null || list.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.end(resData);
        return false;
    }

    var strSql = "UPDATE cfg_as SET ";

    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        if (idx > 0) {
            strSql += ",";
        }

        var type = itemData.type;
        var name = itemData.name;
        var value = itemData.value;

        strSql += name;
        strSql += "=";

        if (type == 'string') {
            strSql += "'";
        }

        strSql += value;

        if (type == 'string') {
            strSql += "'";
        }
    }

    modify_db.modify(strSql, null, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';

            // 通知CC修改
            onNotifyCCModify(list);

            // 日志
            onNotifyLog(list);
        }

        res.send(resData);
    });

});

module.exports = router;