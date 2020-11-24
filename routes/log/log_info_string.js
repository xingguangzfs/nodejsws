/**
 * Created by fushou on 2019/9/25.
 */

exports.getLoginInfoString = function(user_name, ip) {
    return user_name + '用户从' + ip + '登录';
}

exports.getLogoutInfoString = function(user_name, ip) {
    return user_name + '用户从' + ip + '注销';
}

exports.getOverdueInfoString = function(user_name, ip) {
    return user_name + '用户在' + ip + '的会话过期';
}

exports.getModifyPswdInfoString = function(user_name) {
    return user_name + '用户修改密码';
}

exports.getUserAddInfoString = function(user_name) {
    return user_name + '用户添加';
}

exports.getUserModifyInfoString = function(user_name) {
    return user_name + '用户修改';
}

exports.getUserDeleteInfoString = function(user_name) {
    return user_name + '用户删除';
}

exports.getHostAddInfoString = function(ip) {
    return ip + '主机添加';
}

exports.getHostModifyInfoString = function(ip) {
    return ip + '主机修改';
}

exports.getHostDeleteInfoString = function(ip) {
    return ip + '主机删除';
}

exports.getAppAddInfoString = function(app_name) {
    return app_name + '应用添加';
}

exports.getAppModifyInfoString = function(app_name) {
    return app_name + '应用修改';
}

exports.getAppDeleteInfoString = function(app_name) {
    return app_name + '应用删除';
}

exports.getFileUpdateInfoString = function(file_name) {
    return file_name + '文件更新';
}

exports.getCfgModifyInfoString = function(name) {
    return name + '配置修改';
}