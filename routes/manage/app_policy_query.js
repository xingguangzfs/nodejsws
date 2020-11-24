/**
 * Created by fushou on 2019/4/3.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('../child/child_api');

//var cache = require('../../common/Node-Simple-Cache-master/Manage');
//var expire = 0;

// appcloud /v:192.168.0.4 /u:ac003 /p:Now20160901 /app:"||appagent" /app-cmd:"C:\Windows\System32\mspaint.exe"

function on_fail_ack(status, message, res) {
    var resData = {};

    // 非初始化命令，直接返回错误信息
    resData[json_key.getStatusKey()] = status;
    resData[json_key.getMsgKey()] = message;
    res.send(resData);
    return true;
}

function is_cloud_init(type) {
    if (type == 'cloud_init') {
        return true;
    }
    return false;
}

function is_cloud_logout(type) {
    if (type == 'cloud_logout') {
        return true;
    }
    return false;
}

function is_app(type) {
    if (type == 'app') {
        return true;
    }
    return false;
}

function is_cloud_disk(type) {
    if (type == 'cloud_disk') {
        return true;
    }
    return false;
}

function is_cloud_task(type) {
    if (type == 'cloud_task') {
        return true;
    }
    return false;
}

function is_cloud_task_ex(type) {
    if (type == 'cloud_task_ex') {
        return true;
    }
    return false;
}

// gen_cloud_init_command : 生成云初始化命令
function gen_cloud_init_command(item_data) {
    // AppCloud.exe /v:asX /u:username /p:pwd /app:"||appagent" /app-cmd:"<Init>"

    var command = '';

    util.printLog('item_data', item_data);

    var ip = item_data.ip_addr;
    var user_name = item_data[json_key.getUserKey()];
    var rdp_port = item_data[json_key.getRdpPortKey()];
    var app_pswd = item_data[json_key.getPswdKey()];

    // 权限
    var user_file_upload = item_data['user_file_upload'];
    var user_file_download = item_data['user_file_download'];

    if (user_file_upload == undefined || user_file_upload == null) {
        user_file_upload = 0;
    }

    if (user_file_download == undefined || user_file_download == null) {
        user_file_download = 0;
    }

    var app_param = '<Init>';

    // GroupAgent: //
    command = 'AppCloud:// ';

    if (ip != undefined) {
        command += ' /v:' + ip;
    }

    if (rdp_port != undefined) {
        command += ':' + rdp_port;
    }

    if (user_name != undefined) {
        command += ' /u:' + user_name;
    }

    if (app_pswd != undefined) {
        command += ' /p:' + app_pswd;

        command += ' /app:"||AppAgent"';
        command += ' /app-cmd:' + JSON.stringify(app_param);
    }

    if (user_file_upload != undefined) {
        command += ' /file-upload:' + user_file_upload;
    }

    if (user_file_download != undefined) {
        command += ' /file-download:' + user_file_download;
    }

    return command;
}

function gen_cloud_logout_command(item_data) {
   // appcloud.exe /v:asX /u:username /p:pwd /app:"||appagent" /app-cmd:"<Logoff>"
    var command = '';

    util.printLog('item_data', item_data);

    var ip = item_data.ip_addr;
    var user_name = item_data[json_key.getUserKey()];
    var rdp_port = item_data[json_key.getRdpPortKey()];
    var app_pswd = item_data[json_key.getPswdKey()];
    var app_param = '<Logoff>';

    command = 'AppCloud:// ';
    command += ' /v:' + ip;
    command += ':' + rdp_port;
    command += ' /u:' + user_name;
    command += ' /p:' + app_pswd;
    command += ' /app:"||AppAgent"';
    command += ' /app-cmd:' + JSON.stringify(app_param);

    return command;
}

// gen_app_command : 生成APP请求命令
function gen_app_command(item_data) {
    // command: "GroupAgent://  /v:192.168.0.4:3389 /u:ac003 /p:Now20160901 /app:\"||AppAgent\" /app-cmd:\"C:\\\\Windows\\\\System32\\\\notepad.exe\""
    var command = '';

    util.printLog('app command param', item_data);

    var ip = item_data.ip_addr;
    var user_name = item_data[json_key.getUserKey()];
    var rdp_port = item_data[json_key.getRdpPortKey()];
    var app_pswd = item_data[json_key.getPswdKey()];

    // 修正数据库中存储的JSON值
    var app_full_file = util.parseStoragePath(item_data.app_full_file);
    var app_work_path = util.parseStoragePath(item_data.app_work_path);
    var app_param = util.parseStorageParam(item_data.app_param);

    app_full_file = util.getEncoding(app_full_file, 'utf8');
    app_work_path = util.getEncoding(app_work_path, 'utf8');
    app_param = util.getEncoding(app_param, 'utf8');

    command = 'AppCloud:// ';
    command += ' /v:' + ip;
    command += ':' + rdp_port;
    command += ' /u:' + user_name;
    command += ' /p:' + app_pswd;
    command += ' /app:"||AppAgent"';
    command += ' /app-cmd:' + JSON.stringify(app_full_file);

    if (app_param != undefined && app_param != null && app_param != '' && app_param.length > 0) {
        command += ' /app-param:';
        command += JSON.stringify(app_param);
    }

    if (app_work_path != undefined && app_work_path != null && app_work_path != '' && app_work_path.length > 0) {
        command += ' /app-dir:' + JSON.stringify(app_work_path);
    }

    return command;
}

// gen_cloud_disk_command : 生成云盘请求命令
function gen_cloud_disk_command(item_data) {
    // command : appcloud /v:192.168.0.4 /u:ac004 /p:Now20160901 /app:"||appagent" /app-cmd:"<CloudDisk>"
    var command = '';

    util.printLog('item_data', item_data);

    var ip = item_data.ip_addr;
    var user_name = item_data[json_key.getUserKey()];
    var rdp_port = item_data[json_key.getRdpPortKey()];
    var app_pswd = item_data[json_key.getPswdKey()];
    var app_full_file = '<CloudDisk>';

    command = 'AppCloud:// ';
    command += ' /v:' + ip;
    command += ':' + rdp_port;
    command += ' /u:' + user_name;
    command += ' /p:' + app_pswd;
    command += ' /app:"||AppAgent"';
    command += ' /app-cmd:' + JSON.stringify(app_full_file);

    return command;
}

// gen_cloud_task_command : 生成云任务请求命令
function gen_cloud_task_command(item_data) {
    // command : appcloud /v:192.168.0.4 /u:ac004 /p:Now20160901 /app:"||appagent" /app-cmd:"<CloudDisk>"
    var command = '';

    util.printLog('item_data', item_data);

    var ip = item_data.ip_addr;
    var user_name = item_data[json_key.getUserKey()];
    var rdp_port = item_data[json_key.getRdpPortKey()];
    var app_pswd = item_data[json_key.getPswdKey()];
    var app_full_file = '<CloudTask>';

    command = 'AppCloud:// ';
    command += ' /v:' + ip;
    command += ':' + rdp_port;
    command += ' /u:' + user_name;
    command += ' /p:' + app_pswd;
    command += ' /app:"||AppAgent"';
    command += ' /app-cmd:' + JSON.stringify(app_full_file);

    return command;
}

function gen_cloud_task_ex_command(item_data) {
    // command : appcloud /v:192.168.0.4 /u:ac004 /p:Now20160901 /app:"||appagent" /app-cmd:"<CloudTaskEx>"
    var command = '';

    util.printLog('item_data', item_data);

    var ip = item_data.ip_addr;
    var user_name = item_data[json_key.getUserKey()];
    var rdp_port = item_data[json_key.getRdpPortKey()];
    var app_pswd = item_data[json_key.getPswdKey()];
    var app_full_file = '<CloudTaskEx>';

    command = 'AppCloud:// ';
    command += ' /v:' + ip;
    command += ':' + rdp_port;
    command += ' /u:' + user_name;
    command += ' /p:' + app_pswd;
    command += ' /app:"||AppAgent"';
    command += ' /app-cmd:' + JSON.stringify(app_full_file);

    return command;
}

function app_policy_ack(item_data, type, user_id, res) {
    var resData = {};

    var command = '';

    if (is_cloud_init(type)) {
        // 云初始化
        command = gen_cloud_init_command(item_data);
    }
    else if (is_cloud_logout(type)) {
        // 云注销
        command = gen_cloud_logout_command(item_data);
    }
    else if (is_app(type)) {
        // app
        command = gen_app_command(item_data);
    }
    else if (is_cloud_disk(type)) {
        // 云盘
        command = gen_cloud_disk_command(item_data);
    }
    else if (is_cloud_task(type)) {
        // 云任务
        command = gen_cloud_task_command(item_data);
    }
    else {
        on_fail_ack(0, '不支持的命令类型', res);
        return false;
    }

    util.printLog('app policy command', command);

    // 更新历史策略
    var ip = item_data.ip_addr;

    var strSql = "SELECT policy_ip_addr FROM res_user_session WHERE user_id=" + user_id;

    var strSql2 = "UPDATE res_user_session SET policy_ip_addr='";
    strSql2 += ip + "' WHERE user_id=";
    strSql2 += user_id;

    db.query(strSql, function(err1, result1, fields) {
        util.printLog('strSql', strSql);
        util.printLog('result', result1);

        var history_ip = '';
        if (!err1 && result1.length > 0) {
            history_ip = result1[0].policy_ip_addr;
        }
        else if (err1) {
            util.printLog('sqlError', err1);
        }

        if (history_ip == ip) {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getDataKey()] = command;
            res.send(resData);

            return true;
        }
        else {
            modify_db.modify(strSql2, null, function(err2, result2){
                util.printLog('strSql', strSql2);
                util.printLog('result', result2);

                if (err2) {
                    util.printLog('sqlError', err2);
                }

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '查询成功';
                resData[json_key.getDataKey()] = command;
                res.send(resData);

                return true;
            });
        }
    });

}

// app_policy_rdp_port_append : 追加RDP端口号
function app_policy_rdp_port_append(item_data, callback) {

    var rdp_port = util.getRdpPort();

    if (util.IsEmpty(rdp_port)) {
        var strSql = "SELECT rdp_port FROM cfg_as LIMIT 1";
        db.query(strSql, function(err, result, fields){
            util.printLog('strSql', strSql);
            util.printLog('result', result);

            if (err) {
                callback(0, err.message);
            }
            else {
                if (result.length > 0) {
                    rdp_port = result[0].rdp_port;
                }

                if (util.IsEmpty(rdp_port)) {
                    rdp_port = 3389;
                }

                util.setRdpPort(rdp_port);
                item_data[json_key.getRdpPortKey()] = rdp_port;

                callback(1, null);
            }

        });
    }
    else {
        item_data[json_key.getRdpPortKey()] = rdp_port;

        callback(1, null);
    }
}

function app_policy_app_pswd_append(item_data, callback) {
    // 获取缓存的登录密码
    var app_pswd = util.getAppPswd();
    if (util.IsEmpty(app_pswd)) {
        var strSql = "SELECT account_pwd FROM cfg_global";
        db.query(strSql, function(err, result, fields){
            util.printLog('strSql', strSql);
            util.printLog('result', result);
            if (err) {
                callback(0, err.message);
                return false;
            }
            if (result.length > 0) {
                app_pswd = result[0].account_pwd;
            }

            if (util.IsEmpty(app_pswd)) {
                callback(0, '登录密码无效');
                return false;
            }
            else {
                // 更新缓存的APP密码
                util.setAppPswd(app_pswd);

                item_data[json_key.getPswdKey()] = app_pswd;

                callback(1, null);

                return true;
            }
        })
    }
    else {
        item_data[json_key.getPswdKey()] = app_pswd;

        callback(1, null);
    }

}

function app_policy_access_parse(item_data, user_access, access_type) {
    if (access_type == undefined || access_type == null || access_type.length < 1) {
        return;
    }
    var idx = 0;
    for(idx = 0; idx < access_type.length; idx++) {
        var itemData = access_type[idx];

        var item_id = itemData.id;
        var item_name = itemData.name;
        var item_value = 0;

        if (user_access && user_access.includes(item_id)) {
            item_value = 1;
        }
        else {
            item_value = 0;
        }

        item_data[item_name] = item_value;
    }
}

function app_policy_access_append(item_data, type, user_id, callback) {
    var strUserAccessSql = "SELECT access_ids FROM cfg_user_access WHERE user_id=";
    strUserAccessSql += user_id;

    var strAccessTypeSql = "SELECT id,name FROM cfg_access_type";

    var userAccessList = [];
    var accessTypeList = [];

    if (is_cloud_init(type)) {
        db.query(strUserAccessSql, function(err1, resultUserAccess){
            util.printLog('strSql', strUserAccessSql);
            util.printLog('result', resultUserAccess);
            if (!err1 && resultUserAccess.length > 0) {
                userAccessList = resultUserAccess[0].access_ids;
            }

            db.query(strAccessTypeSql, function(err2, resultAccessType){
                util.printLog('strSql', strAccessTypeSql);
                util.printLog('result', resultAccessType);
                if (!err2 && resultAccessType.length > 0) {
                    accessTypeList = resultAccessType;
                }

                app_policy_access_parse(item_data, userAccessList, accessTypeList);

                if (callback) {
                    callback(1, null);
                }
            });
        });
    }
    else {
        if (callback) {
            callback(1, null);
        }
    }
}

function match_policy_filter(user_cores, host_set) {
    // host_set : 列表中只使用 ip_addr 字段
    // as_load_data : {"ip":"192.168.0.4","status":1,"core":8,"user":1}
    // 策略调试规则：如果只有一台主机，只要主机可用就分配，如果有多台则按照负载最轻的分配
    // 负载规则：采用广度优先方法分配

    //util.printLog('app_policy_query_test', host_set);

    var only_host = null;

    if (host_set.length == 1) {
        // 判断主机是否可用
        var itemData = host_set[0];
        var ip_addr = itemData.ip_addr;
        var loadData = util.GetCacheValue(ip_addr);

        //util.printLog('load data', loadData);

        var status = 0;
        var users = 0;
        var cores = 0;

        if (!util.IsEmpty(loadData) && !util.IsEmpty(loadData[json_key.getStatusKey()])) {
            status = loadData[json_key.getStatusKey()];
            users = loadData[json_key.getUserKey()];
            cores = loadData[json_key.getCoreKey()];
        }
        if (status < 1 || util.IsHostOverload(user_cores, users, cores)) {
            // 主机不可用
            return null;
        }
        only_host = host_set[0];
    }
    else if (host_set.length > 1) {

        var min_core = 0;
        var min_user = 0;
        var min_rate = 0;
        var min_host_idx = -1;

        for(var idx = 0; idx < host_set.length; idx++) {
            var itemData = host_set[idx];
            var ip_addr = itemData.ip_addr;

            var loadData = util.GetCacheValue(ip_addr);

            var status = 0;
            var users = 0;
            var cores = 0;

            if (!util.IsEmpty(loadData) && !util.IsEmpty(loadData[json_key.getStatusKey()])) {
                status = loadData[json_key.getStatusKey()];
                users = loadData[json_key.getUserKey()];
                cores = loadData[json_key.getCoreKey()];
            }

            // 主机不在线或者已经满员
            if (status < 1 || util.IsHostOverload(user_cores, users, cores)) {
                // 过滤掉不在线的主机
                continue;
            }

            var item_core = loadData[json_key.getCoreKey()];
            var item_user = loadData[json_key.getUserKey()];
            var item_rate = 100 * item_user / item_core;

            var rate = 100 * users / cores;

            if (min_core == 0) {
                // 第一项，当作最小
                min_core = cores;
                min_user = users;
                min_rate = rate;
                min_host_idx = idx;
            }
            else if (rate < min_rate) {
                // 找出最小项
                min_core = cores;
                min_user = users;
                min_rate = rate;
                min_host_idx = idx;
            }
        }

        if (min_host_idx >= 0) {
            // 已经找到
            only_host = host_set[min_host_idx];
        }
    }

    return only_host;
}

function calAsLoadValidCount(list) {
    var count = 0;
    if (util.IsEmpty(list)) {
        return count;
    }
    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];
        if (itemData[json_key.getStatusKey()] > 0) {
            count++;
        }
    }
    return count;
}

// 获取每个用户CPU核数
function on_get_user_cores(callback) {
    var strSql = "SELECT user_cores FROM cfg_ws LIMIT 1";

    db.query(strSql, function(err, result, fields){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        var user_cores = 0;
        if (!err && result.length > 0) {
            user_cores = result[0].user_cores;
        }

        if (callback) {
            callback(user_cores);
        }
    });
}

function onGetAdminPolicy(req_body, res) {
    var type = req_body.type;
    var id = req_body.id;
    var user_id = req_body.user_id;
    var user_name = req_body.user_name;
    var ip_addr = req_body.ip_addr;

    var resData = {};

    // 获取AS登录密码
    var strSql = "SELECT account_pwd FROM cfg_global LIMIT 1";

    db.query(strSql, function(err, result, fields){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err || result.length < 1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询登录账号失败';
            res.send(resData);
            return false;
        }

        var command = '';

        var pswd = result[0].account_pwd;
        var item_data = {};

        item_data[json_key.getIpAddrKey()] = ip_addr;
        item_data[json_key.getIpKey()] = ip_addr;
        item_data[json_key.getUserKey()] = user_name;
        item_data[json_key.getPswdKey()] = pswd;

        // 追加rdp端口号
        app_policy_rdp_port_append(item_data, function(status, errmsg){
            if (status == 0) {
                // 追加失败
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '查询RDP端口失败';
                res.send(resData);
                return false;
            }

            // 追加成功
            if (is_cloud_task_ex(type)) {
                command = gen_cloud_task_ex_command(item_data);

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '查询成功';
                resData[json_key.getDataKey()] = command;

            }
            else {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '未知命令类型';
                resData[json_key.getTypeKey()] = type;
            }

            res.send(resData);
            return true;

        });

    });
}

function on_get_as_load(callback) {
    // 获取负载信息
    if (!util.IsAsLoadTimeout()) {
        // 不需要更新，直接返回成功
        if (callback) {
            callback(1, null);
        }
    }
    else {
        // 更新缓存实时数据
        child_api.getAsLoad(null, function (err, resultAsLoad) {
            if (err) {
                util.printLog('getAsLoad error', err);
            }

            if (resultAsLoad && resultAsLoad.length > 0) {
                util.printLog('getAsLoad result', resultAsLoad);

                // 更新缓存
                util.SetAsLoadCache(resultAsLoad);
            }

            var success = 0;
            var errmsg = null;
            // 计算有效个数
            var valid_count = calAsLoadValidCount(resultAsLoad);
            if (valid_count < 1) {
                success = 0;
                errmsg = '所有服务器主机不可用';
            }
            else {
                success = 1;
                errmsg = '更新成功';
            }

            if (callback) {
                callback(success, errmsg);
            }
        });
    }
}

function on_match_app_hosts(item_data, type, user_id, user_name, app_id, cores, host_set, callback){
    var success = 0;
    var errmsg = '';

    if (!host_set || host_set.length < 1) {
        if (callback) {
            callback(0, '分配主机失败，支持应用的服务器主机资源已经耗尽');
        }
        return false;
    }

    if (!is_app(type)) {
        // 非APP命令
        var only_item = match_policy_filter(cores, host_set);
        if (only_item == undefined || only_item == null || util.IsEmpty(only_item.host_id)) {
            if (callback) {
                callback(0, '分配主机失败，支持应用的服务器主机资源已经耗尽');
            }
            return false;
        }

        Object.assign(item_data, only_item);

        if (callback) {
            callback(1, '分配主机成功');
        }

        return true;
    }

    // 查询支持指定应用的主机列表
    // SELECT t2.* FROM res_app t1, res_app_map t2 WHERE t1.id=1 AND t1.status=1 AND t1.id=t2.app_id
    var strSql = "SELECT t2.id,t2.app_id,t2.as_id AS host_id,";
    strSql += "t2.app_full_file,t2.app_work_path,t2.app_param,";
    strSql += "t2.remark FROM res_app t1, res_app_map t2 ";
    strSql += "WHERE t1.id=" + app_id;
    strSql += " AND t1.status=1 AND t1.id=t2.app_id AND t2.as_id IN";

    var strSubSql = "(";
    for(var idx = 0; idx < host_set.length; idx++) {
        var itemData = host_set[idx];

        var host_id = itemData.host_id;

        if (idx > 0) {
            strSubSql += ",";
        }
        strSubSql += host_id;
    }
    strSubSql += ")";

    strSql += strSubSql;

    db.query(strSql, function(err, result, fields){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err || result.length < 1) {
            if (callback) {
                callback(0, '分配主机失败，支持应用的服务器主机资源已经耗尽');
            }
            return false;
        }
        else {
            var match_host_app_set = [];
            for(var idx = 0; idx < result.length; idx++) {
                var itemData = result[idx];
                itemData.ip_addr = util.findFieldValue(host_set, 'host_id', itemData.host_id, 'ip_addr');

                if (util.HostIsValid(itemData.ip_addr)) {
                    match_host_app_set.push(itemData);
                }
            }

            var only_item = match_policy_filter(cores, match_host_app_set);
            if (only_item == undefined || only_item == null || util.IsEmpty(only_item.host_id)) {
                if (callback) {
                    callback(0, '分配主机失败，支持应用的服务器主机资源已经耗尽');
                }
                return false;
            }

            Object.assign(item_data, only_item);

            if (callback) {
                callback(1, '分配主机成功');
            }

            return true;
        }
    });
}

function on_app_policy_append(item_data, type, user_id, user_name, callback) {
    var sucess = 0;
    var errmsg = '';

    // 追加用户名
    item_data[json_key.getUserKey()] = user_name;

    // 追加RDP端口号
    app_policy_rdp_port_append(item_data, function(status1, errmsg1){
        if (status1 != 1) {
            sucess = 0;
            errmsg = '生成策略失败，发生内部错误';

            if (callback) {
                callback(sucess, errmsg);
            }
            return false;
        }

        // 追加登录密码
        app_policy_app_pswd_append(item_data, function(status2, errmsg2){
            if (status2 != 1) {
                sucess = 0;
                errmsg = '生成策略失败，发生内部错误';

                if (callback) {
                    callback(sucess, errmsg);
                }
                return false;
            }

            if (callback) {
                callback(1, '生成策略成功');
                return true;
            }
        });

    });
}

function on_get_history_policy(item_data, type, user_id, app_id, callback) {
    // 查询历史派遣主机
    var strHistorySql = "SELECT t1.policy_ip_addr AS host_ip,t2.id AS host_id FROM res_user_session t1, res_as t2 WHERE t1.user_id=";
    strHistorySql += user_id;
    strHistorySql += " AND t1.policy_ip_addr=t2.ip_addr ";
    strHistorySql += " AND t2.status=1";

    var strConfirmSql = "";

    var host_item = null;

    var host_ip = null;
    var host_id = 0;

    var success = 0;
    var errmsg = '';

    db.query(strHistorySql, function(err1, resultHistory, fields){
        util.printLog('strSql', strHistorySql);
        util.printLog('result', resultHistory);

        if (err1 || resultHistory.length < 1) {
            // 历史查询失败
            if (callback) {
                callback(0, '没有历史策略');
            }
            return false;
        }

        // 验证历史主机
        host_ip = resultHistory[0].host_ip;
        host_id = resultHistory[0].host_id;

        var is_ok = false;
        if (!util.IsEmpty(host_ip) && host_id > 0) {
            // 验证历史主机的有效性
            var loadData = util.GetCacheValue(host_ip);
            if (!util.IsEmpty(loadData) && loadData[json_key.getStatusKey()] > 0) {
                is_ok = true;
            }
        }

        if (!is_ok) {
            if (callback) {
                callback(0, '历史主机验证失败');
            }
            return false;
        }

        // 验证是否有权使用此主机
        strConfirmSql = "SELECT id,as_id,user_id FROM res_as_auth t1 WHERE ";
        strConfirmSql += "as_id=" + host_id;
        strConfirmSql += " AND user_id=" + user_id;
        db.query(strConfirmSql, function(err2, resultConfirm, fields2){
            util.printLog('strSql', strConfirmSql);
            util.printLog('result', resultConfirm);

            var is_power = false;
            if (!err2 && resultConfirm.length > 0) {
                for(var idx = 0; idx< resultConfirm.length; idx++) {
                    var itemData = resultConfirm[idx];

                    var item_as_id = itemData.as_id;
                    var item_user_id = itemData.user_id;

                    if (host_id == item_as_id && user_id == item_user_id) {
                        is_power = true;
                        break;
                    }
                }
            }
            else {
                is_power = false;
            }

            if (!is_power) {
                // 用户无权使用此主机
                if (callback) {
                    callback(0, '用户没有被授权使用此主机');
                }
                return false;
            }

            // 用户有权使用此主机
            if (app_id == 0) {
                // 直接追加参数
                item_data['ip_addr'] = host_ip;
                item_data['host_id'] = host_id;

                if (callback) {
                    callback(1, '分配主机成功');
                }
                return true;
            }
            else {
                // APP类命令
                var strAppSql = "SELECT id,app_id,as_id AS host_id,app_full_file,app_work_path,";
                strAppSql += "app_param,remark FROM res_app_map WHERE ";
                strAppSql += " app_id=" + app_id;
                strAppSql += " AND as_id=" + host_id;

                db.query(strAppSql, function(err3, resultApp, fields3){
                    util.printLog('strSql', strAppSql);
                    util.printLog('result', resultApp);

                    if (err3 || resultApp.length < 1) {
                        // 失败
                        success = 0;
                        errmsg = '分配应用主机失败';
                    }
                    else {
                        host_item = resultApp[0];

                        Object.assign(item_data, host_item);

                        item_data['ip_addr'] = host_ip;
                        item_data['host_id'] = host_id;

                        success = 1;
                        errmsg = '分配应用主机成功';
                    }
                    if (callback) {
                        callback(success, errmsg);
                    }
                    return true;
                });
            }

        });
    });
}

function on_get_app_policy(item_data, type, user_id, user_name, app_id, user_cores, callback) {
    // 查询授权主机列表
    var strHostSql = "SELECT t1.as_id AS host_id,t2.ip_addr FROM res_as_auth t1, res_as t2 WHERE t1.user_id=";
    strHostSql += user_id;
    strHostSql += "  AND t2.status=1 AND t1.as_id = t2.id";

    var success = 0;
    var errmsg = '';

    var host_set = [];

    db.query(strHostSql, function(err, resultHost, fields){
        util.printLog('strSql', strHostSql);
        util.printLog('result', resultHost);

        if (!err && resultHost.length > 0) {
            // 只添加有效的主机
            for(var i = 0; i < resultHost.length; i++) {
                var itemData = resultHost[i];
                var ip_addr = itemData.ip_addr;
                if (util.HostIsValid(ip_addr)) {
                    host_set.push(itemData);
                }
            }
        }
        else {
            // 没有授权主机给用户
            success = 0;
            errmsg = '分配主机失败，没有授权服务器主机给用户';

            if (callback) {
                callback(success, errmsg);
            }
            return false;
        }

        if (host_set.length < 1) {
            success = 0;
            errmsg = '分配主机失败，支持应用的服务器主机资源已经耗尽';

            if (callback) {
                callback(success, errmsg);
            }
            return false;
        }

        // 匹配
        on_match_app_hosts(item_data, type, user_id, user_name, app_id, user_cores, host_set, function(status1, errmsg1){
            if (callback) {
                callback(status1, errmsg1);
            }
        });
    });
}

function on_cloud_init(type, user_id, user_name, res) {
    // 初始化命令

    var item_data = {};

    var app_id = 0;
    // 追加用户权限信息
    app_policy_access_append(item_data, type, user_id, function(status1, errmsg1){
        // 获取负载信息
        on_get_as_load(function(status2, errmsg2) {
            if (status2 != 1) {
                // 获取负载信息失败
                app_policy_ack(item_data, type, user_id, res);
                return true;
            }
            else {

                // 获取每个用户核数
                on_get_user_cores(function(cores){
                    // 获取历史策略
                    on_get_history_policy(item_data, type, user_id, app_id, function(status3, errmsg3){
                        if (status3 == 1) {
                            // 历史主机验证成功

                            // 追加其它参数
                            on_app_policy_append(item_data, type, user_id, user_name, function(status4, errmsg4){
                                // 初始化命令都需要返回成功
                                app_policy_ack(item_data, type, user_id, res);
                                return true;
                            })
                        }
                        else {
                            // 重新分配
                            on_get_app_policy(item_data, type, user_id, user_name, app_id, cores, function(status5, errmsg5){
                                if (status5 != 1) {
                                    // 初始化命令都需要返回成功
                                    app_policy_ack(item_data, type, user_id, res);
                                    return true;
                                }
                                else {
                                    // 追加其它参数
                                    on_app_policy_append(item_data, type, user_id, user_name, function(status6, errmsg6){
                                        // 初始化命令都需要返回成功
                                        app_policy_ack(item_data, type, user_id, res);
                                        return true;
                                    })
                                }
                            });
                        }
                    });
                });
            }
        });
    });
}

function on_cloud_logout(type, user_id, user_name, res) {
    var resData = {};
    var item_data = {};

    var app_id = 0;
    // 获取负载信息
    on_get_as_load(function(status1, errmsg1){
        if (status1 != 1) {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '注销成功';
            resData[json_key.getDataKey()] = null;
            res.send(resData);
            return true;
        }

        // 获取历史策略
        on_get_history_policy(item_data, type, user_id, app_id, function(status2, errmsg2){
            if (status2 != 1) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '注销成功';
                resData[json_key.getDataKey()] = null;
                res.send(resData);
                return true;
            }

            // 追加其它参数
            on_app_policy_append(item_data, type, user_id, user_name, function(status3, errmsg3){
                if (status3 != 1) {
                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '注销成功';
                    resData[json_key.getDataKey()] = null;
                    res.send(resData);
                    return true;
                }
                else {
                    // 初始化命令都需要返回成功
                    app_policy_ack(item_data, type, user_id, res);
                    return true;
                }
            })

        });
    });
}

function on_cloud_normal(type, user_id, user_name, app_id, res) {
    var item_data = {};

    on_get_as_load(function(status1, errmsg1){
        if (status1 != 1) {
            on_fail_ack(0, '所有服务器主机不可用', res);
            return false;
        }

        // 获取每个用户核数
        on_get_user_cores(function(cores){
            // 获取历史策略
            on_get_history_policy(item_data, type, user_id, app_id, function(status2, errmsg2) {
                if (status2 == 1) {
                    // 历史主机验证成功

                    // 追加其它参数
                    on_app_policy_append(item_data, type, user_id, user_name, function (status3, errmsg3) {
                        if (status3 != 1) {
                            on_fail_ack(0, errmsg3, res);
                        }
                        else {
                            // 初始化命令都需要返回成功
                            app_policy_ack(item_data, type, user_id, res);
                        }
                        return true;
                    })
                }
                else {
                    // 重新分配
                    on_get_app_policy(item_data, type, user_id, user_name, app_id, cores, function (status4, errmsg4) {
                        if (status4 != 1) {
                            // 初始化命令都需要返回成功
                            on_fail_ack(0, errmsg4, res);
                            return true;
                        }
                        else {
                            // 追加其它参数
                            on_app_policy_append(item_data, type, user_id, user_name, function (status5, errmsg5) {
                                if (status5 != 1) {
                                    on_fail_ack(0, errmsg5, res);
                                }
                                else {
                                    // 初始化命令都需要返回成功
                                    app_policy_ack(item_data, type, user_id, res);
                                }
                                return true;
                            })
                        }
                    });
                }
            });
        });

    });
}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    util.printLog('app policy query req body', req_body)

    var is_admin = req_body.is_admin;
    var type = req_body.type;
    var id = req_body.id;
    var user_id = req_body.user_id;
    var user_name = req_body.user_name;
    var app_id = req_body.app_id;

    var ip_addr = '';

    if (is_admin == undefined || is_admin == null) {
        is_admin = 0;
    }

    if (is_admin > 0) {
        ip_addr = req_body.ip_addr;
    }

    var resData = {};

    // 检查请求参数合法性
    if (is_app(type)) {
        if (id < 1 || user_id < 1 || app_id < 1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '请求参数错误';
            res.send(resData);
            return false;
        }
    }
    else {
        if (user_id < 1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '请求参数错误';
            res.send(resData);
            return false;
        }
    }

    if (is_admin > 0) {
        onGetAdminPolicy(req_body, res);
        return true;
    }

    // 判断命令类型
    if (is_cloud_init(type)) {
        // 初始化命令
        on_cloud_init(type, user_id, user_name, res);
    }
    else if (is_cloud_logout(type)) {
        // 注销命令
        on_cloud_logout(type, user_id, user_name, res);
    }
    else {
        // APP策略或者云任务命令
        on_cloud_normal(type, user_id, user_name, app_id, res);
    }

})

module.exports = router;
