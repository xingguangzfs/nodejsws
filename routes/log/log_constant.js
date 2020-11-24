/**
 * Created by fushou on 2019/9/21.
 */
/* 日志级别 */
exports.getLogLevelInfoId = function() {
    return 1;
}

exports.getLogLevelInfoName = function() {
    return '信息';
}

exports.getLogLevelWarmId = function() {
    return 2;
}

exports.getLogLevelWarmName = function() {
    return '警告';
}

exports.getLogLevelErrorId = function() {
    return 3;
}

exports.getLogLevelErrorName = function() {
    return '错误';
}

/* 管理员事件 */
exports.getLogEventQueryId = function() {
    return 1;
}

exports.getLogEventQueryName = function() {
    return '查询';
}

exports.getLogEventAddId = function() {
    return 2;
}

exports.getLogEventAddName = function() {
    return '添加';
}

exports.getLogEventModifyId = function() {
    return 3;
}

exports.getLogEventModifyName = function() {
    return '修改';
}

exports.getLogEventDeleteId = function() {
    return 4;
}

exports.getLogEventDeleteName = function() {
    return '删除';
}

exports.getLogEventOpenId = function() {
    return 5;
}

exports.getLogEventOpenName = function() {
    return '打开';
}

exports.getLogEventCloseId = function() {
    return 6;
}

exports.getLogEventCloseName = function() {
    return '关闭';
}

exports.getLogEventReadId = function() {
    return 7;
}

exports.getLogEventReadName = function() {
    return '读';
}

exports.getLogEventWriteId = function() {
    return 8;
}

exports.getLogEventWriteName = function() {
    return '写';
}

exports.getLogEventLoginId = function() {
    return 9;
}

exports.getLogEventLoginName = function() {
    return '登录';
}

exports.getLogEventLogoutId = function() {
    return 10;
}

exports.getLogEventLogoutName = function() {
    return '注销';
}

exports.getLogEventForceQuitId = function() {
    return 11;
}

exports.getLogEventForceQuitName = function() {
    return '会话过期';
}

exports.getLogEventUpdateId = function() {
    return 12;
}

exports.getLogEventUpdateName = function() {
    return '更新';
}

exports.getLogStatusSuccessName = function() {
    return '成功';
}

exports.getLogStatusFailName = function() {
    return '失败';
}

/* 用户事件 */
exports.getLogEventUserLoginId = function() {
    return 10001;
}

exports.getLogEventUserLoginName = function() {
    return '登录';
}

exports.getLogEventUserLogoutId = function() {
    return 10002;
}

exports.getLogEventUserLogoutName = function() {
    return '注销'
}

exports.getLogEventUserAddId = function() {
    return 10003;
}

exports.getLogEventUserAddName = function() {
    return '添加';
}

exports.getLogEventUserModifyId = function() {
    return 10004;
}

exports.getLogEventUserModifyName = function() {
    return '修改';
}

exports.getLogEventUserDeleteId = function() {
    return 10005;
}

exports.getLogEventUserDeleteName = function() {
    return '删除';
}

exports.getLogEventUserForceQuitId = function() {
    return 10006;
}

exports.getLogEventUserForceQuitName = function() {
    return '会话过期';
}

/* 主机事件 */
exports.getLogEventHostOnlineId = function() {
    return '20001';
}

exports.getLogEventHostOnlineName = function() {
    return '上线';
}

exports.getLogEventHostOfflineId = function() {
    return '20002';
}

exports.getLogEventHostOfflineName = function() {
    return '离线';
}

/* 应用事件 */
exports.getLogEventAppCreateId = function() {
    return '30001';
}

exports.getLogEventAppCreateName = function() {
    return '创建';
}

exports.getLogEventAppExitId = function() {
    return '30002';
}

exports.getLogEventAppExitName = function() {
    return '结束';
}
