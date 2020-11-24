/**
 * Created by fushou on 2019/1/23.
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

function onUserAccessModify(user_id, access_ids) {
    var str_access_ids = '';
    var item_remark = '';

    if (util.IsEmpty(user_id) || user_id < 1) {
        return false;
    }

    if (access_ids != undefined && access_ids != null && access_ids.length > 0) {
        str_access_ids = JSON.stringify(access_ids);
    }

    var strSqlQueryUserAccess = "SELECT id FROM cfg_user_access ";
    strSqlQueryUserAccess += "WHERE user_id=" + user_id;

    var strSqlInsertUserAccessIds = "INSERT INTO cfg_user_access (";
    strSqlInsertUserAccessIds += "user_id,access_ids,remark) VALUES (";
    strSqlInsertUserAccessIds += user_id + ",";
    strSqlInsertUserAccessIds += "'" + str_access_ids + "',";
    strSqlInsertUserAccessIds += "'" + item_remark + "')";

    var strSqlModifyUserAccessIds = "UPDATE cfg_user_access SET ";
    strSqlModifyUserAccessIds += "access_ids='" + str_access_ids + "',";
    strSqlModifyUserAccessIds += "remark='" + item_remark + "' ";

    db.query(strSqlQueryUserAccess, function(err, result){
        util.printLog('strSql', strSqlQueryUserAccess);
        util.printLog('result', result);

        var access_id = 0;
        if (err) {

        }
        else if (result.length > 0) {
            access_id = result[0].id;
       }

        if (access_id > 0) {
            strSqlModifyUserAccessIds += "WHERE id=" + access_id;

            modify_db.modify(strSqlModifyUserAccessIds, null, function(err2, resultModify){
                util.printLog('strSql', strSqlModifyUserAccessIds);
                util.printLog('result', resultModify);
            })
        }
        else {
            modify_db.insert(strSqlInsertUserAccessIds, null, function(err3, resultInsert){
                util.printLog('strSql', strSqlInsertUserAccessIds);
                util.printLog('result', resultInsert);
            })
        }
    });
}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('user modify req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var user_id = req_body.id;
    var user_name = req_body.name;
    var user_alias = req_body.alias;
    var modify_pswd = req_body.modify_pswd;
    var user_pswd = req_body.pswd;
    var group_id = req_body.group_id;
    var access_ids = req_body.access_ids;
    var weight = req_body.weight;
    var user_status = req_body.status;
    var remark = req_body.remark;

    if ((user_id == 0 || modify_pswd > 0) && util.IsEmpty(user_pswd)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '密码无效';
        return false;
    }

    var strSql = "";
    if (user_id > 0) {
        // 修改
        if (modify_pswd == 0) {
            // 修改常规数据
            strSql = "UPDATE res_user SET ";
            strSql += "name='" + user_name + "',";
            strSql += "alias='" + user_alias + "',";
            strSql += "group_id=" + group_id + ",";
            strSql += "weight=" + weight + ",";
            strSql += "status=" + user_status + ",";
            strSql += "remark='" + remark + "'";
            strSql += " WHERE id=" + user_id;
        }
        else {
            // 修改密码
            strSql = "UPDATE res_user SET ";
            strSql += "pswd='" + user_pswd + "'";
            strSql += " WHERE id=" + user_id;
        }

        modify_db.modify(strSql, function(err, result){
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

                // 修改用户权限
                onUserAccessModify(user_id, access_ids);

                if (modify_pswd == 0) {
                    // 修改用户密码，不需要通知CC
                    // 修改AS用户
                    child_api.changeUser(user_name, user_status, null);
                }
            }

            // log
            var auth = '';
            var source = JSON.stringify(__filename);
            var event_tm = util.getFormatCurTime();
            var info = log_info_string.getUserModifyInfoString(user_name);
            var event = log_constant.getLogEventModifyName();
            var status = log_constant.getLogStatusSuccessName();
            var detail = log_detail_string.getDetailString2(event_tm, 'user_modify', auth, user_name, event, '', status);
            var level_id = log_constant.getLogLevelInfoId();
            var event_id = log_constant.getLogEventModifyId();
            log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

                res.send(resData);
            });


        });
    }
    else {
        // 添加
        strSql = "INSERT INTO res_user(name,alias,pswd,group_id,weight,status,remark) VALUES(";
        strSql += "'" + user_name + "',";
        strSql += "'" + user_alias + "',";
        strSql += "'" + user_pswd + "',";
        strSql += group_id + ",";
        strSql += weight + ",";
        strSql += user_status + ",";
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
                user_id = result[json_key.getInsertIdKey()];

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '添加成功！';

                var dataObj = req_body;
                dataObj[json_key.getIdKey()] = user_id;
                resData[json_key.getDataKey()] = dataObj;

                // 修改用户权限
                onUserAccessModify(user_id, access_ids);

                // 添加AS用户
                child_api.addUser(user_name, user_status, null);
            }

            // log
            var auth = '';
            var source = JSON.stringify(__filename);
            var event_tm = util.getFormatCurTime();
            var info = log_info_string.getUserAddInfoString(user_name);
            var event = log_constant.getLogEventAddName();
            var status = log_constant.getLogStatusSuccessName();
            var detail = log_detail_string.getDetailString2(event_tm, 'user_modify', auth, user_name, event, '', status);
            var level_id = log_constant.getLogLevelInfoId();
            var event_id = log_constant.getLogEventAddId();
            log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){
                res.send(resData);
            });

        });
    }

});

module.exports = router;