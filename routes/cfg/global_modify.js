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
    for(var idx = 0; idx < list.length; idx++) {
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
            case 'account_pwd': {
                target = 'Windows账号密码';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'port': {
                target = '内部通讯端口';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            default: {
                continue;
            }
        }

        var detail = log_detail_string.getDetailString2(event_tm, 'global_modify', auth, target, event, value, status);

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
            case 'account_pwd': {
                // 更新缓存
                util.setAppPswd(value);
                child_api.changeCfgGlobalPswd(value, function(err, result){
                    if (err) {
                        util.printLog('global modify changeCfgGlobalPswd err', err);
                    }
                    else {
                        util.printLog('global modify changeCfgGlobalPswd', result);
                    }
                });
            }break;

            case 'port': {
                child_api.changeCfgGlobalCCPort(value, function(err, result){
                    if (err) {
                        util.printLog('global modify changeCfgGlobalCCPort err', err);
                    }
                    else {
                        util.printLog('global modify changeCfgGlobalCCPort', result);
                    }
                });
            }break;

            default: {
            }break;
        }
    }

}

router.post('/', function(req, res, next) {
    var resData = {};

    var req_body = req.body;

    util.printLog('cfg global modify req body', req_body);

    var list = req_body[json_key.getListKey()];

    if (list == undefined || list == null || list.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.end(resData);
        return false;
    }

    var strSql = "UPDATE cfg_global SET ";

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

            // 发送CC修改
            onNotifyCCModify(list);

            // 写日志
            onNotifyLog(list);
        }

        res.send(resData);
    });

});

module.exports = router;