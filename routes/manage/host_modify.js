/**
 * Created by fushou on 2019/2/20.
 */
/**
 * Created by fushou on 2019/1/23.
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

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('host modify req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var host_id = req_body.id;
    var host_name = req_body.name;
    var host_ip_addr = req_body.ip;
    var host_status = req_body.status;
    var old_host_ip_addr = req_body.old_ip;
    var old_host_status = req_body.old_status;
    var group_id = req_body.group_id;
    var remark = req_body.remark;

    var strSql = "";
    if (host_id > 0) {
        // 修改
        strSql = "UPDATE res_as SET ";
        strSql += "name='" + host_name + "',";
        strSql += "ip_addr='" + host_ip_addr + "',";
        strSql += "status=" + host_status + ",";
        strSql += "group_id=" + group_id + ",";
        strSql += "remark='" + remark + "'";
        strSql += " WHERE id=" + host_id;

        modify_db.modify(strSql, null, function(err, result){
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                console.log(err);

                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '修改失败！错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '修改成功！';
                resData[json_key.getDataKey()] = req_body;

                // 修改AS主机
                child_api.changeAsHost(old_host_ip_addr, old_host_status, host_ip_addr, host_status, null);
            }

            // log
            var auth = '';
            var source = JSON.stringify(__filename);
            var event_tm = util.getFormatCurTime();
            var info = log_info_string.getHostModifyInfoString(host_ip_addr);
            var event = log_constant.getLogEventModifyName();
            var status = log_constant.getLogStatusSuccessName();
            var detail = log_detail_string.getDetailString2(event_tm, 'host_modify', auth, host_ip_addr, event, host_name, status);
            var level_id = log_constant.getLogLevelInfoId();
            var event_id = log_constant.getLogEventModifyId();
            log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

                res.send(resData);
            });

        });
    }
    else {
        // 添加
        strSql = "INSERT INTO res_as(name,ip_addr,status,group_id,remark) VALUES(";
        strSql += "'" + host_name + "',";
        strSql += "'" + host_ip_addr + "',";
        strSql += host_status + ",";
        strSql += group_id + ",";
        strSql += "'" + remark + "')";

        modify_db.insert(strSql, function(err, result){
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                console.log(err);

                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '添加失败！错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '添加成功！';

                var dataObj = req_body;
                dataObj[json_key.getIdKey()] = result[json_key.getInsertIdKey()];

                resData[json_key.getDataKey()] = dataObj;

                // 添加AS主机
                child_api.addAsHost(host_ip_addr, host_status, null);
            }

            // log
            var auth = '';
            var source = JSON.stringify(__filename);
            var event_tm = util.getFormatCurTime();
            var info = log_info_string.getHostAddInfoString(host_ip_addr);
            var event = log_constant.getLogEventAddName();
            var status = log_constant.getLogStatusSuccessName();
            var detail = log_detail_string.getDetailString2(event_tm, 'host_modify', auth, host_ip_addr, event, host_name, status);
            var level_id = log_constant.getLogLevelInfoId();
            var event_id = log_constant.getLogEventAddId();
            log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

                res.send(resData);
            });

        });
    }

});

module.exports = router;
