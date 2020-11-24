/**
 * Created by fushou on 2019/7/19.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

var child_packet = require('../child/child_packet');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

function onExitCCProcess() {
    var childServer = util.GetChildService();
    var exitCCPacket = child_packet.getChildExitPacket(0);

    if (childServer) {
        childServer.onSendToCC(exitCCPacket);
    }
}

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
        var level_id = log_constant.getLogLevelInfoId();
        var event_id = log_constant.getLogEventModifyId();

        switch(name) {
            case 'user_cores': {
                target = '人均CPU核数';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'max_timeout': {
                target = '客户端超时设置';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'mon_period': {
                target = '监控数据更新频率';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            case 'mon_port': {
                util.SetMonPort(value);
                onExitCCProcess();

                target = '监控端口';
                info = log_info_string.getCfgModifyInfoString(target);
            }break;

            default: {
                continue;
            }
        }

        var detail = log_detail_string.getDetailString2(event_tm, 'ws_modify', auth, target, event, value, status);

        log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

        });
    }

}

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('cfg ws modify req body', req_body);

    var list = req_body[json_key.getListKey()];

    if (list == undefined || list == null || list.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.end(resData);
        return false;
    }

    var strSql = "UPDATE cfg_ws SET ";

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

    // 2019-07-19 15:35:54 -> strSql: "UPDATE cfg_ws SET user_cores=4"
    //2019-07-19 15:35:54 -> result: {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":34,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}
    // 条件

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

            // 写日志
            onNotifyLog(list);
        }
        res.send(resData);
    });

});

module.exports = router;

