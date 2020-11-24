/**
 * Created by fushou on 2018/5/22.
 */
var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var async = require('async');
var fs = require('fs');
var util = require('./../../common/util');
var json_key = require('./../../common/json_key');
//var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

var ffi_call = require('../../common/ffi_call');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

function update_theme_db(user_id, rfolder, file_name, text, net_relate_file, res) {
    var resData = {};

    var strSql = "UPDATE res_theme SET text='";
    strSql += text + "' ";
    strSql += "WHERE rfolder='" + rfolder + "' AND ";
    strSql += "file_name='" + file_name + "' AND ";
    strSql += "user_id=" + user_id;

    var strInsertSql = "INSERT INTO res_theme (";
    strInsertSql += "rfolder,file_name,text,user_id) VALUES (";
    strInsertSql += "'" + rfolder + "',";
    strInsertSql += "'" + file_name + "',";
    strInsertSql += "'" + text + "',";
    strInsertSql += user_id;
    strInsertSql += ")";

    modify_db.modify(strSql, null, function(err, result){
        if (global.print_log) {
            console.log('strSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        var affectedRows = 0;
        if (!err) {
            affectedRows = result[json_key.getAffectedRowsKey()];
        }

        if (affectedRows > 0) {
            // 修改成功
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '资源修改成功';
            res.send(resData);
            return true;
        }
        else {
            // 新增
            modify_db.insert(strInsertSql, null, function(err2, result2){
                if (global.print_log) {
                    console.log('strSql: ' + strInsertSql);
                    console.log('result: ' + JSON.stringify(result2));
                }
                if (err2) {
                    resData[json_key.getStatusKey()] = 0;
                    resData[json_key.getMsgKey()] = '资源增加失败，错误消息：' + err2.message;
                }
                else {
                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '资源增加成功';
                    resData[json_key.getIdKey()] = result2[json_key.getInsertIdKey()];
                }
                res.send(resData);
            })
        }
    });
}

function update_owner_db(rfolder, file_name, text, size, net_relate_file, res) {
    var resData = {};

    var target = 'app';
    var remark = 'owner';
    var width = 0;
    var height = 0;
    var enable = 1;
    var position = 0;

    var strInsertSql = "INSERT INTO res_image (";
    strInsertSql += "rfolder,file_name,text,width,height,size,target,";
    strInsertSql += "enable,position,remark) VALUES (";
    strInsertSql += "'" + rfolder + "',";
    strInsertSql += "'" + file_name + "',";
    strInsertSql += "'" + text + "',";
    strInsertSql += width + ",";
    strInsertSql += height + ",";
    strInsertSql += size + ",";
    strInsertSql += "'" + target + "',";
    strInsertSql += enable + ",";
    strInsertSql += position + ",";
    strInsertSql += "'" + remark + "')";

    modify_db.insert(strInsertSql, null, function(err, result){
        util.printLog('strSql', strInsertSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '资源增加失败，错误消息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '资源增加成功';
            resData[json_key.getIdKey()] = result[json_key.getInsertIdKey()];
            resData[json_key.getDataKey()] = net_relate_file;
        }
        res.send(resData);
    })
}

function update_license_db(file_name, count, days, date, res) {
    var resData = {};

    var licenseData = {
        count: count,
        day: days,
        date: date
    }

    var strSql = "UPDATE cfg_license SET file='";
    strSql += file_name;
    strSql += "'";

    var strSql2 = "INSERT INTO cfg_license(file) VALUES('" + file_name + "')";

    modify_db.modify(strSql, null, function(err, result){
        if (global.print_log) {
            console.log('strSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        var affectedRows = 0;
        if (!err) {
            affectedRows = result[json_key.getAffectedRowsKey()];
        }

        if (affectedRows > 0) {
            // 保存License信息
            util.setLicenseCount(count);
            util.setLicenseDay(days);
            util.setLicenseDate(date);

            // 修改成功
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '导入成功';
            resData[json_key.getDataKey()] = licenseData;

            //res.send(resData);

            // log
            var auth = '';
            var source = JSON.stringify(__filename);
            var event_tm = util.getFormatCurTime();
            var info = log_info_string.getFileUpdateInfoString(file_name);
            var event = log_constant.getLogEventUpdateName();
            var status = log_constant.getLogStatusSuccessName();
            var detail = log_detail_string.getDetailString2(event_tm, 'file_upload', auth, file_name, event, licenseData, status);
            var remark = '';
            var level_id = log_constant.getLogLevelInfoId();
            var event_id = log_constant.getLogEventUpdateId();
            log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){
                res.send(resData);
            });
        }
        else {
            modify_db.insert(strSql2, null, function(err2, result2){
                // {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
                util.printLog('strSql', strSql2);
                util.printLog('result', result2);

                if (!err2) {
                    affectedRows = result2[json_key.getAffectedRowsKey()];
                }

                if (affectedRows > 0) {
                    // 保存License信息
                    util.setLicenseCount(count);
                    util.setLicenseDay(days);
                    util.setLicenseDate(date);

                    // 修改成功
                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '导入成功';
                    resData[json_key.getDataKey()] = licenseData;
                }
                else {
                    resData[json_key.getStatusKey()] = 0;
                    resData[json_key.getMsgKey()] = '导入失败';
                }

                //res.send(resData);

                // log
                var auth = '';
                var source = JSON.stringify(__filename);
                var event_tm = util.getFormatCurTime();
                var info = log_info_string.getFileUpdateInfoString(file_name);
                var event = log_constant.getLogEventUpdateName();
                var status = (affectedRows > 0 ? log_constant.getLogStatusSuccessName() : log_constant.getLogStatusFailName());
                var detail = log_detail_string.getDetailString2(event_tm, 'file_upload', auth, file_name, event, licenseData, status);
                var remark = '';
                var level_id = log_constant.getLogLevelInfoId();
                var event_id = log_constant.getLogEventUpdateId();
                log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){
                    res.send(resData);
                });

            });

        }
    })
}

router.post('/', function(req, res, next){

    var resData = {};
    var save_path = util.GetTempImagePath();
    if (!util.PathIsValid(save_path)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '错误：资源存储失败，请稍后重新上传！';
        res.send(resData);
    }

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = save_path; // 指定保存目录
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files){

        if (global.print_log) {
            console.log('file upload fields: ' + JSON.stringify(fields));
            console.log('fileupload files: ' + JSON.stringify(files));
        }

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '发生错误：' + err.message;
            res.send(resData);
            return false;
        }

        // 文件信息
        var info = files['files'];
        if (info == undefined || info == null) {
            info = files['upload_files'];
        }

        if (info == undefined || info == null) {
            // 获取数据失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '上传的文件信息错误';
            res.send(resData);
            return false;
        }

        var size = info.size;
        var path = info.path;
        var name = info.name;
        var type = info.type;
        var mtime = info.mtime;

        // file upload recv files: {"files":{"size":0,"path":"d:\\curProject\\GZWeb\\Group\\public\\temp\\upload_b881e37878ce1d1a928d67129a018fc9","name":"","type":"application/octet-stream","mtime":null}}

        var res_type = fields.res_type;
        if (res_type == 'user_theme') {
            // 用户主题
            var user_id = fields.user_id;
            if (user_id < 0) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '参数错误，上传用户无效';
                res.send(resData);
                return false;
            }

            // 主题目录
            var dst_path = util.GetUserThemePath();
            if (!util.PathIsValid(dst_path)) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '错误：资源存储失败，请稍后重新上传！';
                res.send(resData);
                return false;
            }

            var full_file_name = dst_path + '\\' + name;
            var net_releate_rfolder = util.GetUserThemeNetRelatePath();
            var file_name = name;

            if (global.print_log) {
                console.log('file_upload save temp image: ' + full_file_name);
            }

            // 重命名
            fs.renameSync(path, full_file_name);

            var net_relate_file = net_releate_rfolder + '/' + file_name;

            // 删除临时文件
            util.DeleteFile(path);

            // 保存数据库
            var text = util.SplitName(file_name);

            update_theme_db(user_id, net_releate_rfolder, file_name, text, net_relate_file, res)
        }
        else if (res_type == 'license_file') {
            // License文件
            // 解析文件
            var licenseData = ffi_call.getAuthInfo(path);
            var status = licenseData['status'];
            if (status != 0) {
                // 无效
                resData[json_key.getStatusKey()] = 0;
                var msg = '';
                if (status == 1) {
                    msg = '非法文件';
                }
                else if (status == 2) {
                    msg = '授权已过期';
                }
                else {
                    msg = '其它错误';
                }
                resData[json_key.getMsgKey()] = msg;
                res.send(resData);
                return false;
            }

            var count = licenseData['count']; // 授权用户数
            var days = licenseData['day']; // 有效天数
            var date = licenseData['date']; // 签发日期

            var dst_path = util.GetLicensePath();

            if (!util.PathIsValid(dst_path)) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '错误：资源存储失败，请稍后重新上传！';
                res.send(resData);
                return false;
            }

            var full_file_name = dst_path + '\\' + name;

            if (global.print_log) {
                console.log('file_upload save temp license: ' + full_file_name);
            }
            // 重命名
            fs.renameSync(path, full_file_name);

            var net_rfolder = util.GetLicenseNetRelatePath();

            // 删除临时文件
            util.DeleteFile(path);

            update_license_db(name, count, days, date, res);

        }
        else if (res_type == 'app_icon') {
            var dst_path = util.GetOwnerAppImagePath();

            if (!util.PathIsValid(dst_path)) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '错误：资源存储失败，请稍后重新上传！';
                res.send(resData);
                return false;
            }

            var post_param = fields;
            var icon_text = post_param.icon_text;

            var storage_name = util.GetOwnerNamePrefix() + name;

            var full_file_name = dst_path + '\\' + storage_name;
            var net_releate_rfolder = util.GetOwnerAppImageNetRelatePath();
            var file_name = storage_name;

            util.printLog('file_upload save temp image', full_file_name);

            // 重命名
            fs.renameSync(path, full_file_name);

            var net_relate_file = net_releate_rfolder + '/' + file_name;

            // 删除临时文件
            util.DeleteFile(path);

            // 保存数据库
            update_owner_db(net_releate_rfolder, file_name, icon_text, size, net_relate_file, res);
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '文件上传失败，服务器无法识别资源类型';
            res.send(resData);
        }

    });

})

module.exports = router;


