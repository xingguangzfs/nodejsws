/**
 * Created by fushou on 2019/9/21.
 */

var util = require('../../common/util');
var json_key = require('../../common/json_key');

var log_sql = require('./log_sql');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

function onCallFunction(err, result, callback) {
    if (callback) {
        callback(err, result);
    }
}

exports.insertData = function(param, callback) {
    var resData = {};
    var strSql = log_sql.getLogAdminInsertSql(param);

    if (util.IsEmpty(strSql)) {
        resData[json_key.getErrNoKey()] = 1;
        resData[json_key.getErrMsgKey()] = '参数错误';
        if (callback) {
            callback(resData, null);
        }
        return false;
    }

    modify_db.insert(strSql, null, function(err, result){
        util.printLog('log_admin_db strSql', strSql);
        util.printLog('log_admin_db result', result);
        if (err) {
            resData[json_key.getErrNoKey()] = 2;
            resData[json_key.getErrMsgKey()] = err.message;

            onCallFunction(resData, null, callback);
        }
        else {
            resData[json_key.getErrNoKey()] = 0;
            resData[json_key.getErrMsgKey()] = '增加成功';
            resData[json_key.getDataKey()] = result;

            onCallFunction(null, resData, callback);
        }
    });
}

exports.modifyData = function(param, where_param, callback) {
    var resData = {};
    var strSql = log_sql.getLogAdminModifySql(param, where_param);

    if (util.IsEmpty(strSql)) {
        resData[json_key.getErrNoKey()] = 1;
        resData[json_key.getErrMsgKey()] = '参数错误';
        if (callback) {
            callback(resData, null);
        }
        return false;
    }

    modify_db.modify(strSql, null, function(err, result){
        util.printLog('log_admin_db strSql', strSql);
        util.printLog('log_admin_db result', result);

        if (err) {
            resData[json_key.getErrNoKey()] = 2;
            resData[json_key.getErrMsgKey()] = err.message;

            onCallFunction(resData, null, callback);
        }
        else {
            resData[json_key.getErrNoKey()] = 0;
            resData[json_key.getErrMsgKey()] = '修改成功';
            resData[json_key.getDataKey()] = result;

            onCallFunction(null, resData, callback);
        }
    });
}

exports.deleteData = function(where_param, callback) {
    var resData = {};
    var strSql = log_sql.getLogAdminDeleteSql(where_param);

    if (util.IsEmpty(strSql)) {
        resData[json_key.getErrNoKey()] = 1;
        resData[json_key.getErrMsgKey()] = '参数错误';
        if (callback) {
            callback(resData, null);
        }
        return false;
    }

    modify_db.delete(strSql, function(err, result){
        util.printLog('log_admin_db strSql', strSql);
        util.printLog('log_admin_db result', result);
        if (err) {
            resData[json_key.getErrNoKey()] = 2;
            resData[json_key.getErrMsgKey()] = err.message;

            onCallFunction(resData, null, callback);
        }
        else {
            resData[json_key.getErrNoKey()] = 0;
            resData[json_key.getErrMsgKey()] = '删除成功';
            resData[json_key.getDataKey()] = result;

            onCallFunction(null, resData, callback);
        }
    });
}

exports.queryData = function(fields, where_param, where_op, callback) {
    var resData = {};
    var strSql = log_sql.getLogAdminQuerySql(fields, where_param, where_op);

    if (util.IsEmpty(strSql)) {
        resData[json_key.getErrNoKey()] = 1;
        resData[json_key.getErrMsgKey()] = '参数错误';
        if (callback) {
            callback(resData, null);
        }
        return false;
    }

    db.query(strSql, function(err, result){
        util.printLog('log_admin_db strSql', strSql);
        util.printLog('log_admin_db result', result);
        if (err) {
            resData[json_key.getErrNoKey()] = 2;
            resData[json_key.getErrMsgKey()] = err.message;

            onCallFunction(resData, null, callback);
        }
        else {
            resData[json_key.getErrNoKey()] = 0;
            resData[json_key.getErrMsgKey()] = '查询成功';
            resData[json_key.getListKey()] = result;

            onCallFunction(null, resData, callback);
        }
    });
}

exports.query2Data = function(fields, where_sql, callback) {
    var resData = {};
    var strSql = log_sql.getLogAdminQuerySql2(fields, where_sql);

    if (util.IsEmpty(strSql)) {
        resData[json_key.getErrNoKey()] = 1;
        resData[json_key.getErrMsgKey()] = '参数错误';
        if (callback) {
            callback(resData, null);
        }
        return false;
    }

    db.query(strSql, function(err, result){
        util.printLog('log_admin_db strSql', strSql);
        util.printLog('log_admin_db result', result);
        if (err) {
            resData[json_key.getErrNoKey()] = 2;
            resData[json_key.getErrMsgKey()] = err.message;

            onCallFunction(resData, null, callback);
        }
        else {
            resData[json_key.getErrNoKey()] = 0;
            resData[json_key.getErrMsgKey()] = '查询成功';
            resData[json_key.getListKey()] = result;

            onCallFunction(null, resData, callback);
        }
    })
}