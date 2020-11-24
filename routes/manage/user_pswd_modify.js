/**
 * Created by fushou on 2019/4/10.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('user pswd modify req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var id = req_body.id;
    var name = req_body.name;
    var oldpswd = req_body.oldpswd;
    var newpswd = req_body.newpswd;

    if (util.IsEmpty(id) || id < 1 || util.IsEmpty(oldpswd) || util.IsEmpty(newpswd)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);
        return false;
    }

    var strSql = "UPDATE res_user SET pswd='";
    strSql += newpswd;
    strSql += "' WHERE id=";
    strSql += id;
    strSql += " AND pswd='";
    strSql += oldpswd;
    strSql += "'";

    modify_db.modify(strSql, null, function(err, result){
        if (global.print_log) {
            console.log('strSql: ' + JSON.stringify(strSql));
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err.message;
        }
        else {
            // result: {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}
            var changeRows = result[json_key.getChangedRowsKey()];
            if (changeRows > 0) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '修改成功';
            }
            else {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '原始密码错误或新密码与原始密码相同';
            }
        }

        //res.send(resData);
        // log
        // login result
        var source = JSON.stringify(__filename);
        var event_tm = util.getFormatCurTime();
        var info = log_info_string.getModifyPswdInfoString(name);
        var event = log_constant.getLogEventUserModifyName();
        var status = log_constant.getLogStatusSuccessName();
        var detail = log_detail_string.getDetailString(event_tm, 'user_pswd_modify', name, event, status);
        var remark = '';

        log_api.writeUserModifyPswdLog(source, event_tm, name, info, detail, remark, function(logErr, logResult){

            res.send(resData);
        });

    })
})

module.exports = router;