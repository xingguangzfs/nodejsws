/**
 * Created by fushou on 2019/12/10.
 */
var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');
var child_jbo_base = require('./child_job_base');
var child_job_statis_sql = require('./child_job_statis_sql');

var analysis_engine = require('../statis/analysis/analysis_engine');
var statis_key = require('../statis/statis_key');

var module_name = 'child_job_statis';

function onCorrectNumberValue(val) {
    if (val == undefined || val == null || val == '') {
        return 0;
    }
    return val;
}

// onUpdateUserStatis : 递归分批更新用户统计数据
function onUpdateUserStatis(db_name, cycle_id, begin_tm, end_tm, begin_index, data_list) {
    if (data_list == undefined || data_list == null || data_list.length < 1) {
        return 0;
    }
    if (begin_index < 0 || begin_index >= data_list.length) {
        return 0;
    }

    var mod_count = 5;
    var end_index = (begin_index + mod_count) >= data_list.length ? data_list.length : (begin_index + mod_count);
    if (begin_index >= end_index) {
        return 0;
    }

    var strSql = child_job_statis_sql.getUpdateUserStatisSql(db_name, cycle_id, begin_tm, end_tm, begin_index, end_index, data_list);
    if (strSql == null) {
        return 0;
    }

    modify_db.insert(strSql, null, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        // 递归调用
        onUpdateUserStatis(db_name, cycle_id, begin_tm, end_tm, end_index, data_list);
    });

}

// onUpdateAsStatis : 递归分批更新主机统计数据
function onUpdateAsStatis(db_name, cycle_id, begin_tm, end_tm, begin_index, data_list) {
    if (data_list == undefined || data_list == null || data_list.length < 1) {
        return 0;
    }
    if (begin_index < 0 || begin_index >= data_list.length) {
        return 0;
    }

    var mod_count = 5;
    var end_index = (begin_index + mod_count) >= data_list.length ? data_list.length : (begin_index + mod_count);
    if (begin_index >= end_index) {
        return 0;
    }

    var strSql = child_job_statis_sql.getUpdateAsStatisSql(db_name, cycle_id, begin_tm, end_tm, begin_index, end_index, data_list);
    if (strSql == null) {
        return 0;
    }

    modify_db.insert(strSql, null, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        // 递归调用
        onUpdateAsStatis(db_name, cycle_id, begin_tm, end_tm, end_index, data_list);
    });

}

// onUpdateAppStatis : 递归分批更新应用统计数据
function onUpdateAppStatis(db_name, cycle_id, begin_tm, end_tm, begin_index, data_list) {
    if (data_list == undefined || data_list == null || data_list.length < 1) {
        return 0;
    }
    if (begin_index < 0 || begin_index >= data_list.length) {
        return 0;
    }

    var mod_count = 5;
    var end_index = (begin_index + mod_count) >= data_list.length ? data_list.length : (begin_index + mod_count);
    if (begin_index >= end_index) {
        return 0;
    }

    var strSql = child_job_statis_sql.getUpdateAppStatisSql(db_name, cycle_id, begin_tm, end_tm, begin_index, end_index, data_list);
    if (strSql == null) {
        return 0;
    }

    modify_db.insert(strSql, null, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        // 递归调用
        onUpdateAppStatis(db_name, cycle_id, begin_tm, end_tm, end_index, data_list);
    });
}

// onUserStatis : 用户数据统计
function onUserStatis(begin_tm, end_tm) {
    // 检测是否存在采集周期内的统计数据，统计周期为天
    var cycle_id = 1;
    var db_name = 'statis_user';

    var strStatisSql = child_job_statis_sql.getQueryUserStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
           util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateData(resultStatis, begin_tm, end_tm, 1);
            util.printLog(module_name + ' user update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('user statis data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' user onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var user_statis_data = statis_data[statis_key.getUserKey()];

                            onUpdateUserStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, user_statis_data);
                        }
                    });
                }
            }

       }
    });
}

// onAsStatis : 主机数据统计
function onAsStatis(begin_tm, end_tm) {
    var cycle_id = 1;
    var db_name = 'statis_as';

    var strStatisSql = child_job_statis_sql.getQueryAsStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);

        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateData(resultStatis, begin_tm, end_tm, 1);
            util.printLog(module_name + ' as update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('as statis data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' as onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var as_statis_data = statis_data[statis_key.getAsKey()];

                            onUpdateAsStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, as_statis_data);
                        }
                    });
                }
            }

        }
    });
}

// onAppStatis : 应用数据统计
function onAppStatis(begin_tm, end_tm) {
    var cycle_id = 1;
    var db_name = 'statis_app';

    var strStatisSql = child_job_statis_sql.getQueryAppStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);

        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateData(resultStatis, begin_tm, end_tm, 1);
            util.printLog(module_name + ' app update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('app statis data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' app onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var app_statis_data = statis_data[statis_key.getAppKey()];

                            onUpdateAppStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, app_statis_data);
                        }
                    });
                }
            }

        }
    });
}

// onUserWeekStatis : 按周周期统计用户数据
function onUserWeekStatis(begin_tm, end_tm) {
    // 检测是否存在采集周期内的统计数据，统计周期为天
    var cycle_id = 2;
    var db_name = 'statis_user_week';

    var strStatisSql = child_job_statis_sql.getQueryUserStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateData(resultStatis, begin_tm, end_tm, 7);
            util.printLog(module_name + ' user week update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('user statis week data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' user week onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var user_statis_data = statis_data[statis_key.getUserKey()];

                            onUpdateUserStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, user_statis_data);
                        }
                    });
                }
            }

        }
    });
}

// onAsWeekStatis : 按周周期统计主机数据
function onAsWeekStatis(begin_tm, end_tm) {
    var cycle_id = 2;
    var db_name = 'statis_as_week';

    var strStatisSql = child_job_statis_sql.getQueryAsStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);

        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateData(resultStatis, begin_tm, end_tm, 7);
            util.printLog(module_name + ' as week update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('as statis week data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' as week onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var as_statis_data = statis_data[statis_key.getAsKey()];

                            onUpdateAsStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, as_statis_data);
                        }
                    });
                }
            }

        }
    });
}

// onAppWeekStatis : 按周周期统计应用数据
function onAppWeekStatis(begin_tm, end_tm) {
    var cycle_id = 2;
    var db_name = 'statis_app_week';

    var strStatisSql = child_job_statis_sql.getQueryAppStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);

        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateData(resultStatis, begin_tm, end_tm, 7);
            util.printLog(module_name + ' app week update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('app statis week data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' app week onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var app_statis_data = statis_data[statis_key.getAppKey()];

                            onUpdateAppStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, app_statis_data);
                        }
                    });
                }
            }

        }
    });
}


// onUserMonthStatis : 按月周期统计用户数据
function onUserMonthStatis(begin_tm, end_tm) {
    // 检测是否存在采集周期内的统计数据，统计周期为天
    var cycle_id = 3;
    var db_name = 'statis_user_month';

    var strStatisSql = child_job_statis_sql.getQueryUserStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataMonth(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' user month update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('user statis month data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' user month onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var user_statis_data = statis_data[statis_key.getUserKey()];

                            onUpdateUserStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, user_statis_data);
                        }
                    });
                }
            }

        }
    });
}

function onAsMonthStatis(begin_tm, end_tm) {
    var cycle_id = 3;
    var db_name = 'statis_as_month';

    var strStatisSql = child_job_statis_sql.getQueryAsStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);

        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataMonth(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' as month update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('as statis month data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' as month onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var as_statis_data = statis_data[statis_key.getAsKey()];

                            onUpdateAsStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, as_statis_data);
                        }
                    });
                }
            }

        }
    });
}

function onAppMonthStatis(begin_tm, end_tm) {
    var cycle_id = 3;
    var db_name = 'statis_app_month';

    var strStatisSql = child_job_statis_sql.getQueryAppStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);

        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataMonth(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' app month update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysis(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('app statis month data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' app month onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var app_statis_data = statis_data[statis_key.getAppKey()];

                            onUpdateAppStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, app_statis_data);
                        }
                    });
                }
            }

        }
    });
}

function onUserQuarterStatis(begin_tm, end_tm) {
    var cycle_id = 4;
    var db_name = 'statis_user_quarter';

    var strStatisSql = child_job_statis_sql.getQueryUserStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataQuarter(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' user quarter update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisUserFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('user statis quarter data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' user quarter onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var user_statis_data = statis_data[statis_key.getUserKey()];

                            if (user_statis_data.length > 0) {
                                onUpdateUserStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, user_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onAsQuarterStatis(begin_tm, end_tm) {
    var cycle_id = 4;
    var db_name = 'statis_as_quarter';

    var strStatisSql = child_job_statis_sql.getQueryAsStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataQuarter(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' as quarter update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisAsFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('as statis quarter data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' as quarter onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var as_statis_data = statis_data[statis_key.getAsKey()];

                            if (as_statis_data.length > 0) {
                                onUpdateAsStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, as_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onAppQuarterStatis(begin_tm, end_tm) {
    var cycle_id = 4;
    var db_name = 'statis_app_quarter';

    var strStatisSql = child_job_statis_sql.getQueryAppStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataQuarter(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' app quarter update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisAppFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('app statis quarter data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' app quarter onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var app_statis_data = statis_data[statis_key.getAppKey()];

                            if (app_statis_data.length > 0) {
                                onUpdateAppStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, app_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onUserHalfYearStatis(begin_tm, end_tm) {
    var cycle_id = 5;
    var db_name = 'statis_user_halfyear';

    var strStatisSql = child_job_statis_sql.getQueryUserStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataHalfYear(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' user half year update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisUserFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('user statis half year data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' user half year onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var user_statis_data = statis_data[statis_key.getUserKey()];

                            if (user_statis_data.length > 0) {
                                onUpdateUserStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, user_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onAsHalfYearStatis(begin_tm, end_tm) {
    var cycle_id = 5;
    var db_name = 'statis_as_halfyear';

    var strStatisSql = child_job_statis_sql.getQueryAsStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataHalfYear(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' as half year update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisAsFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('as statis half year data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' as half year onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var as_statis_data = statis_data[statis_key.getAsKey()];

                            if (as_statis_data.length > 0) {
                                onUpdateAsStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, as_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onAppHalfYearStatis(begin_tm, end_tm) {
    var cycle_id = 5;
    var db_name = 'statis_app_halfyear';

    var strStatisSql = child_job_statis_sql.getQueryAppStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataHalfYear(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' app half year update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisAppFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('app statis half year data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' app half year onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var app_statis_data = statis_data[statis_key.getAppKey()];

                            if (app_statis_data.length > 0) {
                                onUpdateAppStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, app_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onUserYearStatis(begin_tm, end_tm) {
    var cycle_id = 6;
    var db_name = 'statis_user_year';

    var strStatisSql = child_job_statis_sql.getQueryUserStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataYear(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' user year update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisUserFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('user statis year data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' user year onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var user_statis_data = statis_data[statis_key.getUserKey()];

                            if (user_statis_data.length > 0) {
                                onUpdateUserStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, user_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onAsYearStatis(begin_tm, end_tm) {
    var cycle_id = 6;
    var db_name = 'statis_as_year';

    var strStatisSql = child_job_statis_sql.getQueryAsStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataYear(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' as year update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisAsFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('as statis year data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' as year onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var as_statis_data = statis_data[statis_key.getAsKey()];

                            if (as_statis_data.length > 0) {
                                onUpdateAsStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, as_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

function onAppYearStatis(begin_tm, end_tm) {
    var cycle_id = 6;
    var db_name = 'statis_app_year';

    var strStatisSql = child_job_statis_sql.getQueryAppStatisSql(db_name, cycle_id, begin_tm, end_tm);

    db.query(strStatisSql, function(err, resultStatis){
        util.printLog('strSql', strStatisSql);
        util.printLog('result', resultStatis);
        if (err) {
            util.printLog(module_name + ' sql error', err.message);
        }
        else {
            // 计算需要统计的时间列表
            var update_time_list = child_jbo_base.onCalculateUpdateDataYear(resultStatis, begin_tm, end_tm);
            util.printLog(module_name + ' app year update time list', update_time_list);

            if (update_time_list && update_time_list.length > 0) {

                // 数据必须得一天一天的统计
                for(var idx = 0; idx < update_time_list.length; idx++) {
                    var itemData = update_time_list[idx];

                    var item_begin_tm = itemData['begin_tm'];
                    var item_end_tm = itemData['end_tm'];

                    analysis_engine.onAnalysisAppFromMonth(item_begin_tm, item_end_tm, function(errno, errmsg, statis_data){
                        util.printLog('app statis year data', statis_data);
                        if (errno != 0) {
                            util.printLog(module_name + ' app year onAnalysis error', errmsg);
                        }
                        else {
                            // 更新数据库记录
                            var statis_begin_tm = statis_data[statis_key.getBeginTmKey()];
                            var statis_end_tm = statis_data[statis_key.getEndTmKey()];

                            var app_statis_data = statis_data[statis_key.getAppKey()];

                            if (app_statis_data.length > 0) {
                                onUpdateAppStatis(db_name, cycle_id, statis_begin_tm, statis_end_tm, 0, app_statis_data);
                            }
                        }
                    });

                }
            }

        }
    });
}

module.exports.onCurIsMonthEnd = function() {
    var cur_dt = new Date();

    var cur_year = cur_dt.getFullYear();
    var cur_month = cur_dt.getMonth();
    var cur_day = cur_dt.getDate();

    return child_jbo_base.onIsMonthEnd(cur_year, cur_month, cur_day);
}

// onJobStatis : 统计日周期数据
module.exports.onJobStatis = function(last_days){
    util.printLog(module_name + ' onJobStatis', last_days);

    // 获取时间范围
    var betweenTime = child_jbo_base.getBetweenTime(last_days);
    if (betweenTime == null || betweenTime == {}) {
        util.printLog(module_name + ' onJobStatis', 'getBetweenTime fail.');
        return;
    }

    var begin_tm = betweenTime['begin_tm'];
    var end_tm = betweenTime['end_tm'];

    // 更新用户统计记录
    onUserStatis(begin_tm, end_tm);

    // 更新主机统计记录
    onAsStatis(begin_tm, end_tm);

    // 更新应用统计记录
    onAppStatis(begin_tm, end_tm);
}

// onJobWeekStatis : 统计周周期数据
module.exports.onJobWeekStatis = function(last_weeks) {
    util.printLog(module_name + ' onJobWeekStatis', last_weeks);

    // 获取时间范围
    var betweenTime = child_jbo_base.getBetweenWeekTime(last_weeks);
    if (betweenTime == null || betweenTime == {}) {
        util.printLog(module_name + ' onJobWeekStatis', 'getBetweenWeekTime fail.');
        return;
    }

    util.printLog(module_name + ' getBetweenWeekTime', betweenTime);

    var begin_tm = betweenTime['begin_tm'];
    var end_tm = betweenTime['end_tm'];

    // 更新用户统计记录
    onUserWeekStatis(begin_tm, end_tm);

    // 更新主机统计记录
    onAsWeekStatis(begin_tm, end_tm);

    // 更新应用统计记录
    onAppWeekStatis(begin_tm, end_tm);

}

// onJobMonthStatis : 按月周期统计数据
module.exports.onJobMonthStatis = function(last_months) {
    util.printLog(module_name + ' onJobMonthStatis', last_months);

    // 获取时间范围
    var betweenTime = child_jbo_base.getBetweenMonthTime(last_months);
    if (betweenTime == null || betweenTime == {}) {
        util.printLog(module_name + ' onJobMonthStatis', 'getBetweenMonthTime fail.');
        return;
    }

    util.printLog(module_name + ' getBetweenMonthTime', betweenTime);

    var begin_tm = betweenTime['begin_tm'];
    var end_tm = betweenTime['end_tm'];

    // 更新用户统计记录
    onUserMonthStatis(begin_tm, end_tm);

    // 更新主机统计记录
    onAsMonthStatis(begin_tm, end_tm);

    // 更新应用统计记录
    onAppMonthStatis(begin_tm, end_tm);
}

// onJobQuarterStatis : 按季周期统计数据
module.exports.onJobQuarterStatis = function() {
    // 获取时间范围
    var betweenTime = child_jbo_base.getBetweenQuarterTime();
    if (betweenTime == null || betweenTime == {}) {
        util.printLog(module_name + ' onJobQuarterStatis', 'getBetweenQuarterTime fail.');
        return;
    }

    util.printLog(module_name + ' getBetweenQuarterTime', betweenTime);

    var begin_tm = betweenTime['begin_tm'];
    var end_tm = betweenTime['end_tm'];

    // 更新用户统计记录
    onUserQuarterStatis(begin_tm, end_tm);

    // 更新主机统计记录
    onAsQuarterStatis(begin_tm, end_tm);

    // 更新应用统计记录
    onAppQuarterStatis(begin_tm, end_tm);
}

// onJobHalfYearStatis : 按半年周期统计数据
module.exports.onJobHalfYearStatis = function() {
    // 获取时间范围
    var betweenTime = child_jbo_base.getBetweenHalfYearTime();
    if (betweenTime == null || betweenTime == {}) {
        util.printLog(module_name + ' onJobHalfYearStatis', 'getBetweenHalfYearTime fail.');
        return;
    }

    util.printLog(module_name + ' getBetweenHalfYearTime', betweenTime);

    var begin_tm = betweenTime['begin_tm'];
    var end_tm = betweenTime['end_tm'];

    // 更新用户统计记录
    onUserHalfYearStatis(begin_tm, end_tm);

    // 更新主机统计记录
    onAsHalfYearStatis(begin_tm, end_tm);

    // 更新应用统计记录
    onAppHalfYearStatis(begin_tm, end_tm);
}

// onJobYearStatis : 按年周期统计数据
module.exports.onJobYearStatis = function() {
    // 获取时间范围
    var betweenTime = child_jbo_base.getBetweenYearTime();
    if (betweenTime == null || betweenTime == {}) {
        util.printLog(module_name + ' onJobYearStatis', 'getBetweenYearTime fail.');
        return;
    }

    util.printLog(module_name + ' getBetweenYearTime', betweenTime);

    var begin_tm = betweenTime['begin_tm'];
    var end_tm = betweenTime['end_tm'];

    // 更新用户统计记录
    onUserYearStatis(begin_tm, end_tm);

    // 更新主机统计记录
    onAsYearStatis(begin_tm, end_tm);

    // 更新应用统计记录
    onAppYearStatis(begin_tm, end_tm);
}