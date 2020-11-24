/**
 * Created by fushou on 2019/9/24.
 */

const log_admin_data = require('./log_admin_data');
const log_admin_db = require('./log_admin_db');

const log_user_data = require('./log_user_data');
const log_user_db = require('./log_user_db');

/*********************************************************************
            管理员用户
 ********************************************************************/

exports.writeAdminLoginLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_admin_data.getLoginLogData(source, event_tm, user_name, info, detail, remark);
    log_admin_db.insertData(param, callback);
}

exports.writeAdminLogoutLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_admin_data.getLogoutLogData(source, event_tm, user_name, info, detail, remark);
    log_admin_db.insertData(param, callback);
}

exports.writeAdminOverdueLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_admin_data.getOverdueLogData(source, event_tm, user_name, info, detail, remark);
    log_admin_db.insertData(param, callback);
}

exports.writeAdminLog = function(level_id, event_id, source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_admin_data.getLogData(level_id, event_id, source, event_tm, user_name, info, detail, remark);
    log_admin_db.insertData(param, callback);
}

/****************************************************************
        普通用户
 ***************************************************************/

// 写用户登录日志
exports.writeUserLoginLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_user_data.getLoginLogData(source, event_tm, user_name, info, detail, remark);
    log_user_db.insertData(param, callback);
}

// 写用户退出日志
exports.writeUserLogoutLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_user_data.getLogoutLogData(source, event_tm, user_name, info, detail, remark);
    log_user_db.insertData(param, callback);
}

// 写用户过期强制退出日志
exports.writeUserOverdueLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_user_data.getOverdueLogData(source, event_tm, user_name, info, detail, remark);
    log_user_db.insertData(param, callback);
}

// 写用户修改密码日志
exports.writeUserModifyPswdLog = function(source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_user_data.getModifyPswdLogData(source, event_tm, user_name, info, detail, remark);
    log_user_db.insertData(param, callback);
}

exports.writeUserLog = function(level_id, event_id, source, event_tm, user_name, info, detail, remark, callback) {
    var param = log_user_data.getLogData(level_id, event_id, source, event_tm, user_name, info, detail, remark);
    log_user_db.insertData(param, callback);
}