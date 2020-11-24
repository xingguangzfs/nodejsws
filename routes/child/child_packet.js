/**
 * Created by fushou on 2019/6/19.
 */
var util = require('../../common/util');
var json_key = require('../../common/json_key');

function onGetNormalPacket(cmdid, id, errno, errmsg, list) {
    var resData = {};

    resData[json_key.getCmdIdKey()] = cmdid;
    resData[json_key.getIdKey()] = id;
    resData[json_key.getErrNoKey()] = errno;
    resData[json_key.getErrMsgKey()] = errmsg;
    if (util.IsEmpty(list)) {
        resData[json_key.getCountKey()] = 0;
        resData[json_key.getListKey()] = [];
    }
    else {
        resData[json_key.getCountKey()] = list.length;
        resData[json_key.getListKey()] = list;
    }

    return resData;
}

function onGetNormalDataPacket(cmdid, id, errno, errmsg, status, data) {
    var resData = {};

    resData[json_key.getCmdIdKey()] = cmdid;
    resData[json_key.getIdKey()] = id;
    resData[json_key.getErrNoKey()] = errno;
    resData[json_key.getErrMsgKey()] = errmsg;
    resData[json_key.getStatusKey()] = status;

    if (util.IsEmpty(data)) {
        resData[json_key.getDataKey()] = null;
    }
    else {
        resData[json_key.getDataKey()] = data;
    }

    resData[json_key.getTimeKey()] = new Date().getTime();

    return resData;
}

exports.getChildWelcomeCmdId = function() {
    return 0;
}

exports.getChildInitCmdId = function() {
    return 1;
}

exports.getChildInitRespCmdId = function() {
    return 8001;
}

exports.getChildExitCmdId = function() {
    return 50;
}

exports.getChildHeartCmdId = function() {
    return 2;
}

exports.getChildHeartRespCmdId = function() {
    return 8002;
}

exports.getChildAsLoadCmdId = function() {
    return 3;
}

exports.getChildAsLoadRespCmdId = function() {
    return 8003;
}

exports.getChildUserActiveCmdId = function() {
    return 4;
}

exports.getChildUserActiveRespCmdId = function() {
    return 8004;
}

exports.getChildAddUserCmdId = function() {
    return 5;
}

exports.getChildAddUserRespCmdId = function() {
    return 8005;
}

exports.getChildDelUserCmdId = function() {
    return 6;
}

exports.getChildDelUserRespCmdId = function() {
    return 8006;
}

exports.getChildChangeUserCmdId = function() {
    return 7;
}

exports.getChildChangeUserRespCmdId = function() {
    return 8007;
}

exports.getChildAddHostCmdId = function() {
    return 8;
}

exports.getChildAddHostRespCmdId = function() {
    return 8008;
}

exports.getChildDelHostCmdId = function() {
    return 9;
}

exports.getChildDelHostRespCmdId = function() {
    return 8009;
}

exports.getChildChangeHostCmdId = function() {
    return 10;
}

exports.getChildChangeHostRespCmdId = function() {
    return 8010;
}

exports.getChildDiscoverHostCmdId = function() {
    return 11;
}

exports.getChildDiscoverHostRespCmdId = function() {
    return 8011;
}

exports.getChildMonUserCmdId = function() {
    return 20;
}

exports.getChildMonUserRespCmdId = function() {
    return 8020;
}

exports.getChildMonHostCmdId = function() {
    return 21;
}

exports.getChildMonHostRespCmdId = function() {
    return 8021;
}

exports.getChildMonAppCmdId = function() {
    return 22;
}

exports.getChildMonAppRespCmdId = function() {
    return 8022;
}

exports.getChildMonAppInstCmdId = function() {
    return 23;
}

exports.getChildMonAppInstRespCmdId = function() {
    return 8023;
}

exports.getChildMonUserActInstCmdId = function() {
    return 24;
}

exports.getChildMonUserActInstRespCmdId = function() {
    return 8024;
}

exports.getChildMonChangeAppFilterCmdId = function() {
    return 25;
}

exports.getChildMonChangeAppFilterRespCmdId = function() {
    return 8025;
}

exports.getChildChangeCfgGlobalPswdCmdId = function() {
    return 50;
}

exports.getChildChangeCfgGlobalPswdRespCmdId = function() {
    return 8050;
}

exports.getChildChangeCfgGlobalCCPortCmdId = function() {
    return 51;
}

exports.getChildChangeCfgGlobalCCPortRespCmdId = function() {
    return 8051;
}

exports.getChildChangeCfgAsAccountAdminCmdId = function() {
    return 52;
}

exports.getChildChangeCfgAsAccountAdminRespCmdId = function() {
    return 8052;
}

exports.getChildChangeCfgAsDesktopDenyCmdId = function() {
    return 53;
}

exports.getChildChangeCfgAsDesktopDenyRespCmdId = function() {
    return 8053;
}

exports.getChildChangeCfgAsRdpPortCmdId = function() {
    return 54;
}

exports.getChildChangeCfgAsRdpPortRespCmdId = function() {
    return 8054;
}

exports.getChildChangeCfgAsPollPeriodCmdId = function() {
    return 55;
}

exports.getChildChangeCfgAsPollPeriodRespCmdId = function() {
    return 8055;
}

exports.getChildAppImageCmdId = function() {
    return 300;
}

exports.getChildAppImageRespCmdId = function() {
    return 8300;
}

exports.getChildWelcomePacket = function(msg) {
    var that = this;
    var resData = {};

    resData[json_key.getCmdIdKey()] = that.getChildWelcomeCmdId();
    resData[json_key.getMsgKey()] = msg;

    return resData;
}

exports.getChildInitPacket = function(id, name, port) {
    var that = this;
    var resData = {};

    resData[json_key.getCmdIdKey()] = that.getChildInitCmdId();
    resData[json_key.getIdKey()] = id;
    resData[json_key.getNameKey()] = name;
    resData[json_key.getPortKey()] = port;
    resData['print_log'] = util.GetPrintLog();

    return resData;
}

exports.getChildInitRespPacket = function(id, errno, errmsg) {
    var that = this;
    var resData = {};

    resData[json_key.getCmdIdKey()] = that.getChildInitRespCmdId();
    resData[json_key.getIdKey()] = id;
    resData[json_key.getErrNoKey()] = errno;
    resData[json_key.getErrMsgKey()] = errmsg;

    return resData;
}

exports.getChildExitPacket = function(id) {
    var that = this;
    var resData = {};

    resData[json_key.getCmdIdKey()] = that.getChildExitCmdId();
    resData[json_key.getIdKey()] = id;

    return resData;
}

exports.getChildHeartPacket = function(id) {
    var that = this;
    var resData = {};

    resData[json_key.getCmdIdKey()] = that.getChildHeartCmdId();
    resData[json_key.getIdKey()] = id;

    return resData;
}

exports.getChildHeartRespPacket = function(id, status, msg, list) {
    var that = this;

    var resData = onGetNormalPacket(that.getChildHeartRespCmdId(), id, status, msg, list);

    return resData;
}

exports.getChildAsLoadPacket = function(ip_addrs, module_id) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildAsLoadCmdId(), module_id, 0, '', ip_addrs);
    return resData;
}

exports.getChildAsLoadRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildAsLoadRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildUserActivePacket = function(unames, module_id) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildUserActiveCmdId(), module_id, 0, '', unames);
    return resData;
}

exports.getChildUserActiveRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildUserActiveRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildAddUserPacket = function(user_name, status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildAddUserCmdId(), module_id, 0, '', status, user_name);
    return resData;
}

exports.getChildAddUserRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildAddUserRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildDelUserPacket = function(user_name, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildDelUserCmdId(), module_id, 0, '', 0, user_name);
    return resData;
}

exports.getChildDelUserRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildDelUserRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeUserPacket = function(user_name, status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeUserCmdId(), module_id, 0, '', status, user_name);
    return resData;
}

exports.getChildChangeUserRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeUserRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildAddHostPacket = function(ip_addr, status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildAddHostCmdId(), module_id, 0, '', status, ip_addr);
    return resData;
}

exports.getChildAddHostRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildAddHostRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildDelHostPacket = function(ip_addr, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildDelHostCmdId(), module_id, 0, '', 0, ip_addr);
    return resData;
}

exports.getChildDelHostRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildDelHostRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeHostPacket = function(old_ip_addr, old_status, new_ip_addr, new_status, module_id) {
    var that = this;

    var reqData = {
        old_ip_addr: old_ip_addr,
        old_status: old_status,
        new_ip_addr: new_ip_addr,
        new_status: new_status
    }

    var resData = onGetNormalDataPacket(that.getChildChangeHostCmdId(), module_id, 0, '', 1, reqData);
    return resData;
}

exports.getChildChangeHostRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeHostRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildDiscoverHostPacket = function(module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildDiscoverHostCmdId(), module_id, 0, '', 1, null);
    return resData;
}

exports.getChildDiscoverHostRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildDiscoverHostRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildMonUserPacket = function(user_data, status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildMonUserCmdId(), module_id, 0, '', status, user_data);
    return resData;
}

exports.getChildMonUserRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildMonUserRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildMonHostPacket = function(user_data, status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildMonHostCmdId(), module_id, 0, '', status, user_data);
    return resData;
}

exports.getChildMonHostRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildMonHostRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildMonAppPacket = function(user_data, status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildMonAppCmdId(), module_id, 0, '', status, user_data);
    return resData;
}

exports.getChildMonAppRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildMonAppRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildMonAppInstPacket = function(exe_file_name, file_desc, file_size, module_id) {
    var that = this;

    var reqData = {
        name: exe_file_name,
        desc: file_desc,
        size: file_size
    };

    var resData = onGetNormalDataPacket(that.getChildMonAppInstCmdId(), module_id, 0, '', 1, reqData);
    return resData;
}

exports.getChildMonAppInstRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;

    var resData = onGetNormalPacket(that.getChildMonAppInstRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildMonUserActInstPacket = function(user_name, module_id) {
    var that = this;

    var resData = onGetNormalDataPacket(that.getChildMonUserActInstCmdId(), module_id, 0, '', 1, user_name);
    return resData;
}

exports.getChildMonUserActInstRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;

    var resData = onGetNormalPacket(that.getChildMonUserActInstRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildMonChangeAppFilterPacket = function(file_name, file_desc, file_size, is_add, module_id) {
    var that = this;

    var reqData = {
        name: file_name,
        desc: file_desc,
        size: file_size,
        is_add: is_add
    }

    var resData = onGetNormalDataPacket(that.getChildMonChangeAppFilterCmdId(), module_id, 0, '', 1, reqData);
    return resData;
}

exports.getChildMonChangeAppFilterRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildMonChangeAppFilterRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeCfgGlobalPswdPacket = function(pswd, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeCfgGlobalPswdCmdId(), module_id, 0, '', 0, pswd);
    return resData;
}

exports.getChildChangeCfgGlobalPswdRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeCfgGlobalPswdRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeCfgGlobalCCPortPacket = function(port, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeCfgGlobalCCPortCmdId(), module_id, 0, '', 0, port);
    return resData;
}

exports.getChildChangeCfgGlobalCCPortRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeCfgGlobalCCPortRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeCfgAsAccountAdminPacket = function(status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeCfgAsAccountAdminCmdId(), module_id, 0, '', status, null);
    return resData;
}

exports.getChildChangeCfgAsAccountAdminRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeCfgAsAccountAdminRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeCfgAsDesktopDenyPacket = function(status, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeCfgAsDesktopDenyCmdId(), module_id, 0, '', status, null);
    return resData;
}

exports.getChildChangeCfgAsDesktopDenyRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeCfgAsDesktopDenyRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeCfgAsRdpPortPacket = function(port, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeCfgAsRdpPortCmdId(), module_id, 0, '', 0, port);
    return resData;
}

exports.getChildChangeCfgAsRdpPortRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeCfgAsRdpPortRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}

exports.getChildChangeCfgAsPollPeriodPacket = function(val, module_id) {
    var that = this;
    var resData = onGetNormalDataPacket(that.getChildChangeCfgAsPollPeriodCmdId(), module_id, 0, '', 0, val);
    return resData;
}

exports.getChildChangeCfgAsPollPeriodRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildChangeCfgAsPollPeriodRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}


exports.getChildAppImagePacket = function(ip, app_full_file, module_id) {
    var that = this;

    var list = [
        {
            ip: ip,
            app_full_file: app_full_file
        }
    ]
    var resData = onGetNormalPacket(that.getChildAppImageCmdId(), module_id, 0, '', list);
    return resData;
}

exports.getChildAppImageRespPacket = function(module_id, errno, errmsg, list) {
    var that = this;
    var resData = onGetNormalPacket(that.getChildAppImageRespCmdId(), module_id, errno, errmsg, list);
    return resData;
}


