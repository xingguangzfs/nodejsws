/**
 * Created by fushou on 2019/12/3.
 */
var util = require('../../../common/util');
var json_key = require('../../../common/json_key');
var statis_key = require('../statis_key');
var db = require('../../../database/mysql_db');
var statis_data = require('./analysis_data');

function onNormalCallback(err, result, callback){
    if (callback) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, result);
        }
    }
}

function onErrorCallback(err) {
    var errmsg = '';
    if (err) {
        errmsg = err.message;
        util.printLog('base analysis err', errmsg);
    }
}

function onGetUserLog(begin_tm, end_tm, callback) {
    // SELECT * FROM log_user WHERE event_tm >= '2019-11-01 00:00:00' AND event_tm <= '2019-12-03 23:23:59' ORDER BY event_tm ASC
    //var strSql = "SELECT * FROM log_user ";
    var strSql = "SELECT id,level_id,event_id,source,";
    strSql += "DATE_FORMAT(event_tm, '%Y-%m-%d %H:%i:%s') AS event_tm,";
    strSql += "DATE_FORMAT(record_tm, '%Y-%m-%d %H:%i:%s') AS record_tm,";
    strSql += "user_name,info,detail,";
    strSql += "remark FROM log_user WHERE event_tm >= '" + begin_tm + "' ";
    strSql += "AND event_tm <= '" + end_tm + "' ";
    strSql += "ORDER BY user_name ASC";

    db.query(strSql, function(err, resultLog){
        util.printLog('strSql', strSql);
        util.printLog('result', resultLog);

        onNormalCallback(err, resultLog, callback);
    });
}

function onGetAsLog(begin_tm, end_tm, callback) {
    //var strSql = "SELECT * FROM log_as ";
    var strSql = "SELECT id,level_id,event_id,source,";
    strSql += "DATE_FORMAT(event_tm, '%Y-%m-%d %H:%i:%s') AS event_tm,";
    strSql += "DATE_FORMAT(record_tm, '%Y-%m-%d %H:%i:%s') AS record_tm,";
    strSql += "info,detail,";
    strSql += "remark FROM log_as WHERE event_tm >='" + begin_tm + "' ";
    strSql += "AND event_tm <='" + end_tm + "' ";
    strSql += "ORDER BY source ASC";

    db.query(strSql, function(err, resultLog){
        util.printLog('strSql', strSql);
        util.printLog('result', resultLog);

        onNormalCallback(err, resultLog, callback);
    });
}

function onGetAppLog(begin_tm, end_tm, callback) {
    //var strSql = "SELECT * FROM log_app ";
    var strSql = "SELECT id,level_id,event_id,source,";
    strSql += "DATE_FORMAT(event_tm, '%Y-%m-%d %H:%i:%s') AS event_tm,";
    strSql += "DATE_FORMAT(record_tm, '%Y-%m-%d %H:%i:%s') AS record_tm,";
    strSql += "user_name,info,detail,app_desc,app_path,app_size,app_process_id,";
    strSql += "remark FROM log_app WHERE event_tm >='" + begin_tm + "' ";
    strSql += "AND event_tm <='" + end_tm + "' ";
    strSql += "ORDER BY app_desc ASC,app_size ASC,app_path ASC";

    db.query(strSql, function(err, resultLog){
        util.printLog('strSql', strSql);
        util.printLog('result', resultLog);

        onNormalCallback(err, resultLog, callback);
    });
}

/*
* onGetUserStatisData : 统计指定表中的用户数据
* */
function onGetUserStatisData(db_name, begin_tm, end_tm, callback) {
    // SELECT user_name,SUM(login_count) AS login_count,
    // SUM(app_count) AS app_count FROM statis_user_month WHERE
    // begin_tm >= '2019-09-01 00:00:00' AND end_tm <= '2019-12-31 23:23:59' GROUP BY user_name

    var strSql = "SELECT user_name,";
    strSql += "SUM(login_count) AS login_count,";
    strSql += "SUM(app_count) AS app_count,";
    strSql += "SUM(app_inst_count) AS app_inst_count";
    strSql += " FROM " + db_name;
    strSql += " WHERE begin_tm >= '" + begin_tm + "'";
    strSql += " AND end_tm <='" + end_tm + "'";
    strSql += " GROUP BY user_name";

    db.query(strSql, function(err, resultData){
        util.printLog('strSql', strSql);
        util.printLog('result', resultData);

        onNormalCallback(err, resultData, callback);
    });
}

/*
* onGetAsStatisData : 统计指定表中的主机数据
* */
function onGetAsStatisData(db_name, begin_tm, end_tm, callback) {
    var strSql = "SELECT ip_addr,";
    strSql += "SUM(online_count) AS online_count,";
    strSql += "SUM(offline_count) AS offline_count,";
    strSql += "SUM(user_count) AS user_count,";
    strSql += "SUM(app_count) AS app_count,";
    strSql += "SUM(app_inst_count) AS app_inst_count";
    strSql += " FROM " + db_name;
    strSql += " WHERE begin_tm >= '" + begin_tm + "' ";
    strSql += " AND end_tm <= '" + end_tm + "'";
    strSql += " GROUP BY ip_addr";

    db.query(strSql, function(err, resultData){
        util.printLog('strSql', strSql);
        util.printLog('result', resultData);

        onNormalCallback(err, resultData, callback);
    });
}

/*
*  onGetAppStatisData : 统计指定表中的应用数据
* */
function onGetAppStatisData(db_name, begin_tm, end_tm, callback) {
    var strSql = "SELECT file_name,app_full_name,app_desc,app_size,";
    strSql += "SUM(host_count) AS host_count,";
    strSql += "SUM(user_count) AS user_count,";
    strSql += "SUM(app_inst_count) AS app_inst_count";
    strSql += " FROM " + db_name;
    strSql += " WHERE begin_tm >= '" + begin_tm + "' ";
    strSql += " AND end_tm <= '" + end_tm + "'";
    strSql += " GROUP BY file_name,app_full_name,app_desc,app_size";

    db.query(strSql, function(err, resultData){
        util.printLog('strSql', strSql);
        util.printLog('result', resultData);

        onNormalCallback(err, resultData, callback);
    });
}

function onAnalysisAppLogDatas(begin_tm, end_tm, datas) {
    // 分析应用基础数据
    var ret_datas = statis_data.onAnalysisAppBaseData(begin_tm, end_tm, datas);

    return ret_datas;
}

function onAnalysisAsDatas(begin_tm, end_tm, as_datas, app_datas) {
    // 分析主机基础数据
    var ret_datas = statis_data.onAnalysisAsBaseData(begin_tm, end_tm, as_datas);

    // 分析主机应用数据
    statis_data.onAnalysisAsAppData(ret_datas, app_datas);

    return ret_datas;
}

function onAnalysisUserDatas(begin_tm, end_tm, datas, app_datas) {
    // 分析用户基础数据
    var ret_datas = statis_data.onAnalysisUserBaseData(begin_tm, end_tm, datas);

    // 分析用户应用数据
    statis_data.onAnalysisUserAppData(ret_datas, app_datas);

    return ret_datas;
}

function onAnalysisLog(begin_tm, end_tm, app_log_datas, as_log_datas, user_log_datas) {
    var data = {};
    var ret_app = onAnalysisAppLogDatas(begin_tm, end_tm, app_log_datas);
    var ret_as = onAnalysisAsDatas(begin_tm, end_tm, as_log_datas, app_log_datas);
    var ret_user = onAnalysisUserDatas(begin_tm, end_tm, user_log_datas, app_log_datas);

    data[statis_key.getBeginTmKey()] = begin_tm;
    data[statis_key.getEndTmKey()] = end_tm;
    data[statis_key.getAppKey()] = ret_app;
    data[statis_key.getAsKey()] = ret_as;
    data[statis_key.getUserKey()] = ret_user;

    return data;
}

/*
 * onAnalysis : 常规日志统计引擎，以系统日志为数据源进行统计
 */
exports.onAnalysis = function(begin_tm, end_tm, callback) {
    // 获取应用日志
    onGetAppLog(begin_tm, end_tm, function(errApp, resultAppLog){
        // 获取主机日志
        onGetAsLog(begin_tm, end_tm, function(errAs, resultAsLog){
           // 获取用户日志
            onGetUserLog(begin_tm, end_tm, function(errUser, resultUserLog){
                var errno = 0;
                var errmsg = '';
                var data = null;
                if (errApp || errAs || errUser) {
                    // 出错
                    onErrorCallback(errApp);
                    onErrorCallback(errAs);
                    onErrorCallback(errUser);

                    errno = -1;
                    errmsg = '内部错误';
                    data = null;
                }
                else {
                    // 成功，解析数据
                    var resData = onAnalysisLog(begin_tm, end_tm, resultAppLog, resultAsLog, resultUserLog);

                    errno = 0;
                    errmsg = '完成';
                    data = resData;
                }

                if (callback) {
                    callback(errno, errmsg, data);
                }
            });
        });
    });
}

/*
* onAnalysisUserFromMonth : 用户数据统计，以月统计数据为数据源进行统计
* */
exports.onAnalysisUserFromMonth = function(begin_tm, end_tm, callback) {
    var db_name = 'statis_user_month';

    var errno = -1;
    var errmsg = '';
    var data = null;
    onGetUserStatisData(db_name, begin_tm, end_tm, function(err, result){
        if (err) {
            errno = -1;
            errmsg = '内部错误';
            data = null;
        }
        else {
            errno = 0;
            errmsg = '完成';

            var resData = {};
            resData[statis_key.getBeginTmKey()] = begin_tm;
            resData[statis_key.getEndTmKey()] = end_tm;
            resData[statis_key.getAppKey()] = null;
            resData[statis_key.getAsKey()] = null;
            resData[statis_key.getUserKey()] = result;

            data = resData;
        }
        callback(errno, errmsg, data);
    });
}

/*
* onAnalysisAsFromMonth : 主机数据统计，以月统计数据为数据源进行统计
* */
exports.onAnalysisAsFromMonth = function(begin_tm, end_tm, callback) {
    var db_name = 'statis_as_month';

    var errno = -1;
    var errmsg = '';
    var data = null;

    onGetAsStatisData(db_name, begin_tm, end_tm, function(err, result){
        if (err) {
            errno = -1;
            errmsg = '内部错误';
            data = null;
        }
        else {
            errno = 0;
            errmsg = '完成';

            var resData = {};
            resData[statis_key.getBeginTmKey()] = begin_tm;
            resData[statis_key.getEndTmKey()] = end_tm;
            resData[statis_key.getAppKey()] = null;
            resData[statis_key.getAsKey()] = result;
            resData[statis_key.getUserKey()] = null;

            data = resData;
        }
        callback(errno, errmsg, data);
    });
}

/*
* onAnalysisAppFromMonth : 应用数据统计，以月统计数据为数据源进行统计
* */
exports.onAnalysisAppFromMonth = function(begin_tm, end_tm, callback) {
    var db_name = 'statis_app_month';

    var errno = -1;
    var errmsg = '';
    var data = null;

    onGetAppStatisData(db_name, begin_tm, end_tm, function(err, result){
        if (err) {
            errno = -1;
            errmsg = '内部错误';
            data = null;
        }
        else {
            errno = 0;
            errmsg = '完成';

            var resData = {};
            resData[statis_key.getBeginTmKey()] = begin_tm;
            resData[statis_key.getEndTmKey()] = end_tm;
            resData[statis_key.getAppKey()] = result;
            resData[statis_key.getAsKey()] = null;
            resData[statis_key.getUserKey()] = null;

            data = resData;
        }
        callback(errno, errmsg, data);
    });
}