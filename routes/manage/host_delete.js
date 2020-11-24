/**
 * Created by fushou on 2019/2/20.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('../child/child_api');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

function delete_relative_data(modify_database, as_id, as_name, as_ip, res) {
    var resData = {};

    // 应用映射表
    var strSql = "DELETE FROM res_app_map WHERE as_id=" + as_id;
    var strSql2 = "DELETE FROM res_as_auth WHERE as_id=" + as_id;

    modify_database.delete(strSql, function(err, result){
        if (global.print_log) {
            console.log('strSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }

        modify_database.delete(strSql2, function(err2, result2){
            if (global.print_log) {
                console.log('strSql: ' + strSql2);
                console.log('result: ' + JSON.stringify(result2));
            }

            if (err) {
                resData[json_key.getStatusKey()] = 2;
                resData[json_key.getMsgKey()] = '主项删除成功，关联数据删除失败';
            }
            else if (err2) {
                resData[json_key.getStatusKey()] = 2;
                resData[json_key.getMsgKey()] = '主项删除成功，关联数据删除失败';
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '删除成功';
            }

            //res.send(resData);

            // log
            var auth = '';
            var source = JSON.stringify(__filename);
            var event_tm = util.getFormatCurTime();
            var info = log_info_string.getHostDeleteInfoString(as_ip);
            var event = log_constant.getLogEventDeleteName();
            var status = log_constant.getLogStatusSuccessName();
            var detail = log_detail_string.getDetailString2(event_tm, 'host_delete', auth, as_ip, event, as_name, status);
            var remark = '';
            var level_id = log_constant.getLogLevelInfoId();
            var event_id = log_constant.getLogEventDeleteId();
            log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){
                res.send(resData);
            });

        })

    })
}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('host delete req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var id = req_body.id;
    var name = req_body.name;
    var ip = req_body.ip;

    if (id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误，编号无效';
        res.send(resData);
        return false;
    }
    else {
        var strSql = "SELECT ip_addr FROM res_as WHERE id=" + id;
        var strSql2 = "DELETE FROM res_as WHERE id=" + id;

        db.query(strSql, function(err, result){
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }

            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败！错误信息：' + err.message;
                res.send(resData);
                return false;
            }
            else if (result.length < 1) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败，数据不存在！';
                res.send(resData);
                return false;
            }
            else {
                var ip_addr = result[0].ip_addr;
                modify_db.delete(strSql2, function(err2, result2){
                    if (global.print_log) {
                        console.log('reqSql: ' + strSql2);
                        console.log('result: ' + JSON.stringify(result2));
                    }
                    if (err2) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '删除失败！错误信息：' + err2.message;
                        res.send(resData);
                        return false;
                    }
                    else {
                        // 删除AS主机
                        child_api.delAsHost(ip_addr, null);
                        // 删除关联数据
                        delete_relative_data(modify_db, id, name, ip, res);

                    }
                });
            }
        });

    }

});

module.exports = router;
