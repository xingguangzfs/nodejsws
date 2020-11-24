/**
 * Created by fushou on 2019/7/8.
 */

var wrapper = require('../../common/wrapper');
var util = require('../../common/util');
var child_packet = require('./child_packet');

var cc_task = require('../net/cc_task');

var module_id = 0;
var module_name = 'child_api';

exports.getAsLoad = function(ip_addrs, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildAsLoadPacket(ip_addrs, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.getUserActive = function(unames, callback){
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildUserActivePacket(unames, module_id);
        //return wsc.onsend(reqPacket, callback);

        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        });
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.addUser = function(user_name, status, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildAddUserPacket(user_name, status, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.delUser = function(user_name, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildDelUserPacket(user_name, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeUser = function(user_name, status, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeUserPacket(user_name, status, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.addAsHost = function(ip_addr, status, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildAddHostPacket(ip_addr, status, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.delAsHost = function(ip_addr, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildDelHostPacket(ip_addr, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeAsHost = function(old_ip_addr, old_status, new_ip_addr, new_status, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeHostPacket(old_ip_addr, old_status, new_ip_addr, new_status, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.discoverAsHost = function(callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildDiscoverHostPacket(module_id);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name + ' discoverAsHost', result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeCfgGlobalPswd = function(pswd, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeCfgGlobalPswdPacket(pswd, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeCfgGlobalCCPort = function(port, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeCfgGlobalCCPortPacket(port, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeCfgAsAccountAdmin = function(status, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeCfgAsAccountAdminPacket(status, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeCfgAsDesktopDeny = function(status, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeCfgAsDesktopDenyPacket(status, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeCfgAsRdpPort = function(port, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeCfgAsRdpPortPacket(port, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.changeCfgAsPollPeriod = function(val, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildChangeCfgAsPollPeriodPacket(val, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.getAppInst = function(ext_file_name, file_desc, file_size, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildMonAppInstPacket(ext_file_name, file_desc, file_size, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.getUserActInst = function(user_name, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildMonUserActInstPacket(user_name, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

exports.getAppImage = function(ip, app_full_file, callback) {
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildAppImagePacket(ip, app_full_file, module_id);
        //return wsc.onsend(reqPacket, callback);
        // 设置超时请求
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
            util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        })
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}

// changeMonAppFilter ： 修改应用监控的过滤表
exports.changeMonAppFilter = function(file_name, file_desc, file_size, is_add, callback) {
    // is_add : 为1则添加APP过滤，为0则删除APP过滤
    var wsc = util.GetWebClient();
    if (wsc) {
        var reqPacket = child_packet.getChildMonChangeAppFilterPacket(file_name, file_desc, file_size, is_add, module_id);
        wrapper.promiseWrapper(wsc.onsend, 10000, reqPacket, function(err, result){
           util.printLog(module_name, result);
            if (callback) {
                callback(err, result);
            }
        });
    }
    else if (callback) {
        callback(null, []);
    }
    return false;
}