/**
 * Created by fushou on 2019/9/24.
 */
const log_constant = require('./log_constant');
const json_key = require('../../common/json_key');
const util = require('../../common/util');

// 用户登录
exports.getLoginLogData = function(source, event_tm, user_name, info, detail, remark) {
    var resData = {};

    var ct = util.getFormatCurTime();

    resData[json_key.getLevelIdKey()] = log_constant.getLogLevelInfoId();
    resData[json_key.getEventIdKey()] = log_constant.getLogEventLoginId();
    resData[json_key.getSourceKey()] = source;
    resData[json_key.getEventTmKey()] = event_tm;
    resData[json_key.getRecordTmKey()] = ct;
    resData[json_key.getUserNameKey()] = user_name;
    resData[json_key.getInfoKey()] = info;
    resData[json_key.getDetailKey()] = detail;
    resData[json_key.getRemarkKey()] = remark;

    return resData;
}

// 用户退出
exports.getLogoutLogData = function(source, event_tm, user_name, info, detail, remark) {
    var resData = {};

    var ct = util.getFormatCurTime();

    resData[json_key.getLevelIdKey()] = log_constant.getLogLevelInfoId();
    resData[json_key.getEventIdKey()] = log_constant.getLogEventLogoutId();
    resData[json_key.getSourceKey()] = source;
    resData[json_key.getEventTmKey()] = event_tm;
    resData[json_key.getRecordTmKey()] = ct;
    resData[json_key.getUserNameKey()] = user_name;
    resData[json_key.getInfoKey()] = info;
    resData[json_key.getDetailKey()] = detail;
    resData[json_key.getRemarkKey()] = remark;

    return resData;
}

// 用户登录过期数据
exports.getOverdueLogData = function(source, event_tm, user_name, info, detail, remark) {
    var resData = {};

    var ct = util.getFormatCurTime();

    resData[json_key.getLevelIdKey()] = log_constant.getLogLevelInfoId();
    resData[json_key.getEventIdKey()] = log_constant.getLogEventForceQuitId();
    resData[json_key.getSourceKey()] = source;
    resData[json_key.getEventTmKey()] = event_tm;
    resData[json_key.getRecordTmKey()] = ct;
    resData[json_key.getUserNameKey()] = user_name;
    resData[json_key.getInfoKey()] = info;
    resData[json_key.getDetailKey()] = detail;
    resData[json_key.getRemarkKey()] = remark;

    return resData;
}

exports.getLogData = function(level_id, event_id, source, event_tm, user_name, info, detail, remark) {
    var resData = {};

    var ct = util.getFormatCurTime();

    resData[json_key.getLevelIdKey()] = level_id;
    resData[json_key.getEventIdKey()] = event_id;
    resData[json_key.getSourceKey()] = source;
    resData[json_key.getEventTmKey()] = event_tm;
    resData[json_key.getRecordTmKey()] = ct;
    resData[json_key.getUserNameKey()] = user_name;
    resData[json_key.getInfoKey()] = info;
    resData[json_key.getDetailKey()] = detail;
    resData[json_key.getRemarkKey()] = remark;

    return resData;
}