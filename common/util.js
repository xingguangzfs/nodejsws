/**
 * Created by fushou on 2018/6/11.
 */
var fs=require('fs');
var json_key = require('./json_key');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var encoding = require('encoding');
var iconv = require('iconv-lite');
var os = require("os")

var db = require('../database/mysql_db');

// md5加密
exports.encode =  function cryptmd5pwd(str) {
    var md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
}

// 返回签名
exports.getSecret = function() {
    return this.encode('Now20160901');
}

exports.getToken = function(userid, username) {
    var time = process.uptime();
    var secret = this.getSecret();
    var token = jwt.sign({
            id: userid,
            name: username,
            time: time
        },
        secret,{
            expiresIn: 0 // 期限秒时间
        });
    return token;
}

exports.decodeToken = function(token) {
    var rslt = {};
    try {
        rslt = jwt.decode(
                token,{
                    complete: true
                }) || {};
    }
    catch(err) {
        console.log(JSON.stringify(err));
        rslt = {};
    }
    return rslt;
}

exports.IsEmpty = function(param) {
    if (param == undefined || param == null || param == '' || param=={})
        return true;
    if (typeof(param) == "string" && param.toString() == "") {
        return true;
    }
    if (typeof (param) == "object" && param == {}) {
        return true;
    }
    return false;
}

exports.SetChildService= function(child) {
    global.child_service = child;
}

exports.GetChildService = function() {
    return global.child_service;
}

exports.SetWebServer = function(wss) {
    global.web_server = wss;
}

exports.GetWebServer = function() {
    return global.web_server;
}

exports.SetWebClient = function(wsc) {
    global.web_client = wsc;
}

exports.GetWebClient = function() {
    return global.web_client;
}

exports.SetMonPort = function(port) {
    global.mon_port = port;
}

exports.GetMonPort = function() {
    return global.mon_port;
}

exports.SetMonHost = function(host) {
    global.mon_host = host;
}

exports.GetMonHost = function() {
    return global.mon_host;
}

exports.SetCCOP = function(op) {
    global.cc_op = op;
}

exports.GetCCOP = function() {
    return global.cc_op;
}

exports.SetMapList = function(list) {
    global.map_list = list;
}

exports.GetMapList = function() {
    var list = global.map_list;
    if (list == undefined || global.map_list == null) {
        return null;
    }
    return list;
}

exports.GetMapListKey = function(type) {
    var key = '';
    switch (type) {
        case 'mon_user': {
            key = 'mon_user';
        }break;

        case 'mon_host': {
            key = 'mon_host';
        }break;

        case 'mon_app': {
            key = 'mon_app';
        }break;
    }
    return key;
}

exports.GetCache = function() {
    return global.cache;
}

exports.SetCache = function(cache) {
    global.cache = cache;
}

exports.SetCacheValue = function(key, value) {
    this.printLog('cache set data', key + ' - ' + JSON.stringify(value));

    var cache = this.GetCache();
    if (cache != undefined && cache != null) {
        cache.set(key, value);
    }
}

exports.GetCacheValue = function(key) {
    var cache = this.GetCache();
    if (cache != undefined && cache != null) {
        return cache.get(key);
    }
    return null;
}

// 保存AS主机负载缓存
exports.SetAsLoadCache = function(list) {
    if (!list || list == undefined || list.length < 1) {
        return;
    }
    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        var key = itemData.ip;

        this.SetCacheValue(key, itemData);
    }

    this.SetAsLoadLastTime();
}

exports.SetAsLoadLastTime = function() {
    // 返回自nodejs启动以来的秒数，精度为毫秒，例如：3.996
    global.as_load_last_tm = process.uptime();

}

exports.GetAsLoadLastTime = function() {
    return global.as_load_last_tm;
}

// 判断AS负载缓存是否超时
exports.IsAsLoadTimeout = function() {
    var time_out = 1;

    var last_tm = this.GetAsLoadLastTime();
    if (last_tm == undefined || last_tm == null) {
        return true;
    }

    var cur_tm = process.uptime();

    return ((cur_tm - last_tm) >= time_out ? true : false);
}

// 设置用户活动数据
exports.SetUserActiveCache = function(list) {
    if (!list || list == undefined || list.length < 1) {
        return;
    }
    var cur_tm = process.uptime();
    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];
        itemData[json_key.getTimeKey()] = cur_tm;

        var key = itemData.name;

        this.SetCacheValue(key, itemData);
    }

    this.SetUserActiveLastTime();
}

exports.SetUserActiveLastTime = function() {
    global.user_active_last_tm = process.uptime();
}

exports.GetUserActiveLastTime = function() {
    return global.user_active_last_tm;
}

// 判断用户活动缓存是否超时
exports.IsUserActiveTimeout = function() {
    var time_out = 1;

    var last_tm = this.GetUserActiveLastTime();
    if (last_tm == undefined || last_tm == null) {
        return true;
    }

    var cur_tm = process.uptime();

    return ((cur_tm - last_tm) >= time_out ? true : false);
}

exports.HostIsValid = function(ip_addr) {
    var loadData = this.GetCacheValue(ip_addr);

    var status = 0;
    if (this.IsEmpty(loadData)) {
        return false;
    }
    if (!this.IsEmpty(loadData[json_key.getStatusKey()])) {
        status = loadData[json_key.getStatusKey()];
    }
    return (status > 0 ? true : false);
}

exports.IsHostOverload = function(user_cores, users, cores) {
    // 判断AS主机是否负载过重，false为没有过重，true为过重
    if (user_cores <= 0) {
        // 没有限制
        return false;
    }

    if (cores <= 0) {
        return true;
    }

    if (users < 0) {
        return false;
    }

    // 判断再凌驾一个用户是否超载
    return ((cores / (users + 1)) >= user_cores ? false : true);
}

exports.GetRootPath = function() {
    return global.app_path;
}

exports.SetRootPath = function(path) {
    global.app_path = path;
}

exports.SetPrintLog = function(enable) {
    global.print_log = enable;
}

exports.GetPrintLog = function() {
    return global.print_log;
}

exports.GetTempImagePath = function() {
    var rootPath = this.GetRootPath();
    var resPath = rootPath + '\\public\\temp';
    return resPath;
}

exports.GetTempImageNetRelatePath = function() {
    return 'temp';
}

exports.GetUserThemePath = function() {
    var rootPath = this.GetRootPath();
    var resPath = rootPath + '\\public\\images\\theme\\user';
    return resPath;
}

exports.GetUserThemeNetRelatePath = function() {
    var resPath = 'images/theme/user';

    return resPath;
}

exports.GetLicensePath = function() {
    var rootPath = this.GetRootPath();
    var resPath = rootPath + "\\public\\license";
    return resPath;
}

exports.GetLicenseNetRelatePath = function() {
    var resPath = 'license';
    return resPath;
}

exports.GetAppImagePath = function() {
    var rootPath = this.GetRootPath();
    var resPath = rootPath + '\\public\\images\\app';
    return resPath;
}

exports.GetAutoAppImagePath = function() {
    var rootPath = this.GetRootPath();
    var resPath = rootPath + '\\public\\images\\app\\auto';
    return resPath;
}

exports.GetAutoAppImageNetRelatePath = function() {
    return 'images/app/auto';
}

exports.GetOwnerAppImagePath = function() {
    var rootPath = this.GetRootPath();
    var resPath = rootPath + '\\public\\images\\app\\owner';
    return resPath;
}

exports.GetOwnerAppImageNetRelatePath = function() {
    return 'images/app/owner';
}

exports.GetTargetAppImageRFolder = function() {
    return 'images/app';
}

exports.GetOwnerNamePrefix = function() {
    var mm = moment();
    var dt = mm.format('YYYY_MM_DD_HH_mm_ss_');
    return dt;
}

exports.PathIsExisted = function(path) {
    try {
        fs.accessSync(path,fs.F_OK);
    }
    catch(e) {
        global.last_error_msg = JSON.stringify(e);
        return false;
    }
    return true;
}

exports.PathCreat = function(path) {
    try {
        // 备注：目录需要一层一层创建
        fs.mkdirSync(path);
    }
    catch(e) {
        global.last_error_msg = JSON.stringify(e);
        return false;
    }
    return true;
}

exports.PathIsValid = function(path) {
    try {
        if (!this.PathIsExisted(path)) {
            this.PathCreat(path);
        }
    }
    catch(e) {
        global.last_error_msg = JSON.stringify(e);
        return false;
    }
    return true;
}

exports.GetFileSize = function(file) {
    var sz = 0;
    try {
        const stats = fs.statSync(file);
        sz = stats.size;
    }
    catch(e) {
        global.last_error_msg = JSON.stringify(e);
        sz = 0;
    }
    return sz;
}

exports.SplitName = function(file_name) {
    var str_list = file_name.split('.');
    if (str_list.length > 0) {
        return str_list[0];
    }
    return file_name;
}

exports.GetNowTimeFileName = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var rd = Math.floor(Math.random()*1000); // [0 ~ 1000) 随机数，包含0，不包含1000
    var fname = year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString() + second.toString() + rd.toString();
    return fname;
}

exports.CopyFileUseStream = function(src_file_name, dst_file_name) {
    try {
        fs.createReadStream(src_file_name).pipe(fs.createWriteStream(dst_file_name));
    }
    catch(e) {
        global.last_error_msg = JSON.stringify(e);
        return false;
    }
    return true;
}

exports.DeleteFile = function(file_name) {
    try {
        fs.unlinkSync(file_name);
    }
    catch(e) {
        global.last_error_msg = JSON.stringify(e);
        return false;
    }
    return true;
}

exports.SendNormalResMsg = function(res, code, data) {
    res.writeHeader(code, {'Content-Type': 'text/plain;charset=utf-8'});

    //var status = data[json_key.getStatusKey()];
    //var msg = data[json_key.getMsgKey()];

    res.write(JSON.stringify(data));
    res.end();
}

exports.sendError = function(res, err) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
}

exports.GetGroupName = function(group_id, groups) {
    var group_name = '';
    if (group_id > 0) {
        for(var idx = 0; idx < groups.length; idx++) {
            var itemData = groups[idx];
            if (itemData.id == group_id) {
                group_name = itemData.name;
                break;
            }
        }
    }
    return group_name;
}

exports.getGroupDataCount = function(group_id, group_list) {
    var count = 0;
    if (group_id > 0 && group_list.length > 0) {
        for(var idx = 0; idx < group_list.length; idx++) {
            var itemData = group_list[idx];
            if (itemData.group_id == group_id) {
                count = itemData.count;
                break;
            }
        }
    }
    return count;
}

exports.setLicenseCount = function(count) {
    global.license_count = count;
}
exports.getLicenseCount = function() {
    return global.license_count;
}
exports.setLicenseDay = function(day) {
    global.license_day = day;
}
exports.getLicenseDay = function() {
    return global.license_day;
}
exports.setLicenseDate = function(date) {
    global.license_date = date;
}
exports.getLicenseDate = function() {
    return global.license_date;
}

exports.dateToString = function(date) {
    var dt = '';

    if (date.length >= 8) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6, 2);

        dt = year + '-' + month + '-' + day;
    }

    return dt;
}

exports.formatDate = function(date, day) {
    var begin_date = this.dateToString(date);
    var end_date = '';
    if (begin_date == '') {
        // 失败
        return begin_date;
    }
    if (day > 0) {
        var mm = moment(begin_date);
        end_date = mm.add(day, 'days').format('YYYY-MM-DD');
    }
    else {
        end_date = begin_date;
    }
    return end_date;
}

exports.diffDay = function(end_date) {
    var m1 = moment(); // 当前时间
    var m2 = moment(end_date);
    var days = m2.diff(m1, 'days');
    return days;
}

exports.continueSeconds = function(begin_tm) {
    // 当前时间减去开始时间
    var tt = moment().diff(moment(begin_tm), 'seconds');
    return tt;
}

exports.getFormatCurTime = function() {
    var mm = moment();
    var dt = mm.format('YYYY-MM-DD HH:mm:ss');
    return dt;
}

exports.getReqToken = function(req) {
    var token = '';
    try {
        var reqAuthor = req.get("Authorization"); // 从Authorization中获取token
        var arr = reqAuthor.split(' ');
        if (arr.length > 1) {
            token = arr[1];
        }
    }
    catch(e) {
        token = '';
    }
    return token;
}

exports.getReqHost = function(req) {
    var host = '';
    try {
        var headers = req.headers;
        host = headers.host;
    }
    catch (e) {
        host = '';
    }
    return host;
}

exports.trimLeft = function(str,substr) {
    var substrlen = substr.length;
    var restr = str;
    if (substrlen < 1) {
        return restr;
    }
    var index = -1;
    while((index = restr.indexOf(substr)) == 0) {
        restr = restr.substr(substrlen);
    }
    return restr;
}

exports.trimRight = function(str, substr) {
    var substrlen = substr.length;
    var restr = str;
    if (substrlen < 1) {
        return restr;
    }
    var index = -1;
    while((index = restr.lastIndexOf(substr)) == (restr.length - substrlen)) {
       restr = restr.substr(0, restr.length - substrlen);
    }
    return restr;
}

exports.trim = function(str, substr) {
    var str1 = this.trimLeft(str, substr);
    var str2 = this.trimRight(str1, substr);
    return str2;
}

exports.subLeftValidStr = function(str) {
    var retStr = '';

    var pos = str.indexOf('\u0000');
    if (pos > 0) {
        retStr = str.substr(0, pos);
    }
    else {
        retStr = str;
    }
    return retStr;
}

exports.generateWinPath = function(value) {
    // 去掉两头空格
    var cval = this.trim(value, '"');

    var resValue = '';

    if (cval.indexOf('\\\\') >= 0) {
        resValue = cval;
    }
    else {
        var spe = '\\';

        var arr = cval.split(spe);
        if (arr.length > 0) {
            for(var idx=0; idx < arr.length; idx++) {
                var itemData = arr[idx];
                resValue += itemData;
                if (idx < arr.length - 1) {
                    resValue += '\\\\';
                }
            }
        }
        else {
            resValue = cval;
        }
    }

    return resValue;
}

exports.generateStoragePath = function(value) {
    if (value == '') {
        return value;
    }
    var resValue = {
        path: value
    }
    return JSON.stringify(resValue);
}

exports.parseStoragePath = function(value) {
    var resValue = '';
    try {
        var key1 = 'path';
        var key2 = '}';

        var pos1 = value.indexOf(key1);
        var pos2 = value.lastIndexOf(key2);
        if (pos1 >=0 && pos2 > pos1) {
            resValue = value.substring(pos1 + key1.length + 3, pos2 - 1);
            console.log('storage resparam: ' + resValue);
        }
    }
    catch(e) {
        console.log('parseStoragePath: ' + JSON.stringify(value));
        console.log('parseStoragePath error: ' +JSON.stringify(e));
        resValue = '';
    }
    return resValue;
}

exports.generateStorageParam = function(value) {
    if (value == '') {
        return value;
    }
    var resData = {
        param: value
    }
    return JSON.stringify(resData);
}

exports.parseStorageParam = function(value) {
    // {"param":""-run \"CNEXT.exe\" -env CATIA_P3.V5-6R2016.B26 -direnv \"C:\\ProgramData\\DassaultSystemes\\CATEnv\" -nowindow""}
    var resValue = '';
    try {
        var key1 = 'param';
        var key2 = '}';

        var pos1 = value.indexOf(key1);
        var pos2 = value.lastIndexOf(key2);
        if (pos1 >=0 && pos2 > pos1) {
            resValue = value.substring(pos1 + key1.length + 3, pos2 - 1);
            console.log('storage resparam: ' + resValue);
        }
    }
    catch(e) {
        console.log('parseStorageParam: ' + JSON.stringify(value));
        console.log('parseStorageParam error: ' + JSON.stringify(e));
        resValue = '';
    }
    return resValue;
}

exports.printLog = function(stdPref, msg) {
    if (global.print_log) {
        var mm = moment();
        var tm = mm.format('YYYY-MM-DD HH:mm:ss');
        console.log(tm + ' -> ' + stdPref + ': ' + JSON.stringify(msg));
    }
}

exports.findFieldValue = function(list, find_field_name, find_field_value, result_field_name) {
    // findFieldValue : 根据指定字段名称及字段值，查找对应项的字段值
    var result_value = '';
    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        var field_value = itemData[find_field_name];

        if (find_field_value == field_value) {
            result_value = itemData[result_field_name];
            break;
        }
    }

    return result_value;
}

exports.getAppPswd = function() {
    return global.app_pswd;
}

exports.setAppPswd = function(value) {
    global.app_pswd = value;
}

exports.getRdpPort = function() {
    return global.rdp_port;
}

exports.setRdpPort = function(value) {
    global.rdp_port = value;
}

exports.getEncoding = function(str, encode) {
    return encoding.convert(str, encode).toString();
}

exports.getDecodeZhBuffer = function(buff, charset) {
    var str = '';
    try {
        if (charset == undefined) {
            charset = 'utf8';
        }
        str = iconv.decode(buff, charset);
    }
    catch (err) {
        str = '';
    }
    return str;
}

exports.getLocalHostIp = function() {
    // 获取本机IP地址
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return null;
}

exports.setLocalHostIpCache = function(ip) {
    global.local_host_ip = ip;
}

exports.getLocalHostIpCache = function() {
    return global.local_host_ip;
}

/*exports.setWebsocketPortCache = function(port) {
    global.websocket_port = port;
}

exports.getWebsocketPortCache = function() {
    return global.websocket_port;
}*/

exports.getModuleFileName = function() {
    return __filename;
}

exports.getClientIp = function(req) {
    // 获取客户端IP地址
    // 需要将监听改成：server.listen（port, 0.0.0.0） IPV4格式
    try{
        return req.headers['x-wq-realip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    }catch(e){
        return "";
    }
}

exports.getMonPort = function(callback) {
    var that = this;

    var port = 3391;

    var strSql = "SELECT mon_port FROM cfg_ws LIMIT 1";
    db.query(strSql, function(err, result){
        that.printLog('strSql', strSql);
        that.printLog('result', result);

        if (!err && result.length > 0) {
            port = result[0].mon_port;

            if (callback) {
                callback(port);
            }
        }

    });
}