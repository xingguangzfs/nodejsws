/**
 * Created by fushou on 2019/1/21.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../common/json_key');
var util = require('../common/util');
var db = require('../database/mysql_db');
var modify_db = require('../database/modify_mysql_db');
var ffi_call = require('../common/ffi_call');

var log_api = require('./log/log_api');
var log_constant = require('./log/log_constant');
var log_info_string = require('./log/log_info_string');
var log_detail_string  = require('./log/log_detail_string');

function login_verify(user_id, user_name, weight, client_ip, res) {
    var resData = {};

    var token = util.getToken(user_id, user_name);

    if (global.print_log) {
        console.log('login token: ' + JSON.stringify(token));
    }

    // 添加用户会话
    login_session(token, user_id, user_name, weight, client_ip, function(err2, status){
        console.log('login session: ' + JSON.stringify(status));
        if (status > 0) {
            // license 验证
            license_verify(user_id, user_name, weight, token, client_ip, res);
            //return true;
        }
        else if (err2) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '验证失败!，错误信息：' + err2.message;
            res.send(resData);
            return false;
        }
        else {
            resData[json_key.getStatusKey()] = 2;
            resData[json_key.getMsgKey()] = '会话验证失败，请重新登录';
            res.send(resData);
            return false;
        }
    })
}

function login_session(token, user_id, user_name, weight, client_ip, callback) {
    var ct = util.getFormatCurTime();

    var res_status = -1;
    var status = 1;

    var policy_ip_addr = '';

    var strSql1 = "UPDATE res_user_session SET ";
    strSql1 += "user_name='" + user_name + "',";
    strSql1 += "weight=" + weight + ",",
    strSql1 += "login_tm='" + ct + "',";
    strSql1 += "last_tm='" + ct + "',";
    strSql1 += "status=" + status + ",";
    strSql1 += "token='" + token + "',";
    strSql1 += "policy_ip_addr='" + policy_ip_addr + "',";
    strSql1 += "client_ip_addr='" + client_ip + "' ";
    strSql1 += "WHERE user_id=" + user_id;

    var strSql2 = "INSERT INTO res_user_session(";
    strSql2 += "user_id,user_name,weight,create_tm,";
    strSql2 += "login_tm,last_tm,status,token,policy_ip_addr,client_ip_addr) VALUES(";
    strSql2 += user_id + ",";
    strSql2 += "'" + user_name + "',";
    strSql2 += weight + ",";
    strSql2 += "'" + ct + "',";
    strSql2 += "'" + ct + "',";
    strSql2 += "'" + ct + "',";
    strSql2 += status + ",";
    strSql2 += "'" + token + "',";
    strSql2 += "'" + policy_ip_addr + "',";
    strSql2 += "'" + client_ip + "')";

    modify_db.modify(strSql1, null, function(err, result) {
        if (global.print_log) {
            console.log('strSql: ' + strSql1);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            res_status = -1;
            callback(err, res_status);
        }
        else {
            var affs = result[json_key.getAffectedRowsKey()];
            if (affs > 0) {
                // 更新成功
                res_status = affs;
                callback(err, res_status);
            }
            else {
                // 更新失败，改为添加
                modify_db.insert(strSql2, null ,function(err2, result2){
                    if (global.print_log) {
                        console.log('strSql: ' + strSql2);
                        console.log('result: ' + JSON.stringify(result2));
                    }
                    if (err2) {
                        res_status = -1;
                        callback(err2, res_status);
                    }
                    else {
                        res_status = result2[json_key.getInsertIdKey()];
                        callback(err2, res_status);
                    }
                })
            }
        }
    })
}

function license_verify(user_id, user_name, weight, token, client_ip, res) {
    var resData = {};

    resData[json_key.getIdKey()] = user_id;
    resData[json_key.getNameKey()] = user_name;
    resData[json_key.getTokenKey()] = token;
    if (weight == 0) {
        resData[json_key.getRoleKey()] = 'administrator';
    }
    else {
        resData[json_key.getRoleKey()] = 'normal';
    }

    var strSql = "SELECT file FROM cfg_license";

    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log('strSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 3;
            resData[json_key.getMsgKey()] = 'License验证失败';
            res.send(resData);
            return false;
        }
        else if (result.length == 0) {
            resData[json_key.getStatusKey()] = 4;
            resData[json_key.getMsgKey()] = '系统未获得授权，请立即注册';
            res.send(resData);
            return false;
        }
        else {

            var licensePath = util.GetLicensePath();
            var license_file = licensePath + '\\' + result[0].file;

            var resLicense = ffi_call.getAuthInfo(license_file);

            if (global.print_log) {
                console.log('license file: ' + license_file);
                console.log('license result: ' + JSON.stringify(resLicense));
            }

            var license_status = resLicense[json_key.getStatusKey()];
            if (license_status == 0) {
                var count = resLicense['count'];
                var day = resLicense['day'];
                var date = resLicense['date'];
                // 保存
                util.setLicenseCount(count);
                util.setLicenseDay(day);
                util.setLicenseDate(date);

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '验证成功';

                // log
                // login result
                var source = JSON.stringify(__filename);
                var event_tm = util.getFormatCurTime();
                var info = log_info_string.getLoginInfoString(user_name, client_ip);
                var event = log_constant.getLogEventLoginName();
                if (weight > 0) {
                    event = log_constant.getLogEventUserLoginName();
                }
                var status = log_constant.getLogStatusSuccessName();
                var detail = log_detail_string.getDetailString(event_tm, 'login', user_name, event, status, client_ip);
                var remark = '';

                if (weight == 0) {
                    log_api.writeAdminLoginLog(source, event_tm, user_name, info, detail, remark, null)
                }
                else {
                    log_api.writeUserLoginLog(source, event_tm, user_name, info, detail, remark, null)
                }

                res.send(resData);
                return true;
            }
            else if (license_status == 1) {
                // 非法文件
                resData[json_key.getStatusKey()] = 5; // 5
                resData[json_key.getMsgKey()] = '系统未获得授权，请立即注册';
                res.send(resData);
                return false;
            }
            else if (license_status == 2) {
                // 授权已经过期
                resData[json_key.getStatusKey()] = 5;
                resData[json_key.getMsgKey()] = 'License授权已经过期';
                res.send(resData);
                return false;
            }
            else {
                // 其它错误
                resData[json_key.getStatusKey()] = 5;
                resData[json_key.getMsgKey()] = 'License验证发生未知错误';
                res.send(resData);
                return false;
            }
        }
    });
}

/* POST home page. */
router.post('/', function(req, res, next) {

    var req_body = req.body;

    if (global.print_log) {
        console.log('login req body: ' + JSON.stringify(req_body));
    }

    var force = req_body.force;
    var user_name = req_body.username;
    var pswd = req_body.password;

    // 获取客户端IP
    var client_ip = util.getClientIp(req);

    // 验证用户名密码
    var strSql = "SELECT id,weight FROM res_user WHERE";
    strSql += " name='" + user_name + "'";
    strSql += " AND pswd='" + pswd + "'";

    // 验证是否已经登录
    var strSql2 = "";

    var resData = {};
    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log('reqSql: ' + JSON.stringify(strSql));
            console.log('result: ' + JSON.stringify(result));
        }

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '验证失败!，错误信息：' + err.message;
            res.send(resData);
            return false;
        }
        else if (result.length < 1) {
            resData[json_key.getStatusKey()] = 2;
            resData[json_key.getMsgKey()] = '验证失败，用户名或者密码有错误';
            res.send(resData);
            return false;
        }
        else {
            var itemData = result[0];
            var id = itemData.id;
            var weight = itemData.weight;

            if (force == 0) {
                // 询问模式，验证用户是否已经登录
                strSql2 = "SELECT status FROM res_user_session WHERE user_id=" + id;
                db.query(strSql2, function(err2, result2, fields2){
                    if (global.print_log) {
                        console.log('strSql: ' + strSql2);
                        console.log('result: ' + JSON.stringify(result2));
                    }
                    if (err2) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '验证失败!，错误信息：' + err2.message;
                        res.send(resData);
                        return false;
                    }
                    else {
                        var login_status = 0;
                        if (result2.length > 0) {
                            login_status = result2[0].status;
                        }

                        if (login_status > 0) {
                            // 已经登录
                            resData[json_key.getStatusKey()] = 20;
                            resData[json_key.getMsgKey()] = '用户已经登录';
                            res.send(resData);
                            return false;
                        }
                        else {
                            // 登录验证
                            login_verify(id, user_name, weight, client_ip, res);
                        }
                    }
                })
            }
            else {
                // 登录验证
                login_verify(id, user_name, weight, client_ip, res);
            }

        }

    });

});

module.exports = router;