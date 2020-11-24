/**
 * Created by fushou on 2018/6/27.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

function is_exists(host_id, hosts) {
    for(var idx = 0; idx < hosts.length; idx++) {
        var itemData = hosts[idx];
        if (host_id == itemData.host_id) {
            return true;
        }
    }
    return false;
}

function is_compare(detailItemData, app_param, db_data_list) {
    var rslt = {
        status: 0
    };

    for(var idx = 0; idx < db_data_list.length; idx++) {
        var itemData = db_data_list[idx];

        if (detailItemData.host_id == itemData.host_id) {
            if (detailItemData.app_full_file == itemData.app_full_file &&
                detailItemData.app_work_path == itemData.app_work_path &&
                app_param == itemData.app_param) {
                rslt['status'] = 2;
            }
            else {
                rslt['status'] = 1;
                rslt['id'] = itemData.id;
            }
            break;
        }
    }

    return rslt;
}

function app_insert_detail(modify_db, start_index, app_id, old_app_id, app_text, app_param, data_list, res) {
    // 递归添加
    var resData = {};

    var max_count = 10;
    var end_index = (start_index + max_count) < data_list.length ? (start_index + max_count) : data_list.length;
    if (end_index <= start_index) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    var strInsertSql = "INSERT INTO res_app_map (app_id,";
    strInsertSql += "as_id,app_full_file,app_work_path,";
    strInsertSql += "app_param,remark) VALUES ";
    for(var idx = start_index; idx < end_index; idx++) {
        var itemData = data_list[idx];

        var itemSql = "";

        if (idx > start_index) {
            itemSql += ",";
        }

        itemSql += "(";
        itemSql += app_id + ",";
        itemSql += itemData.host_id + ",";
        itemSql += "'" + itemData.app_full_file + "',";
        itemSql += "'" + itemData.app_work_path + "',";
        itemSql += "'" + app_param + "',";
        itemSql += "'" + itemData.remark + "'";
        itemSql += ")";

        strInsertSql += itemSql;
    }

    modify_db.insert(strInsertSql, function(err, result){
        if (global.print_log) {
            console.log('reqSql: ' + strInsertSql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '错误消息: ' + err.message;
            res.send(resData);
            return false;
        }
        else {
            // 递归
            if (end_index >= data_list.length) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '执行成功';

                //res.send(resData);
                //return true;

                // log
                var auth = '';
                var source = JSON.stringify(__filename);
                var event_tm = util.getFormatCurTime();
                var info = (old_app_id == 0 ? log_info_string.getAppAddInfoString(app_text) : log_info_string.getAppModifyInfoString(app_text));
                var event = (old_app_id == 0 ? log_constant.getLogEventAddName() : log_constant.getLogEventModifyName());
                var status = log_constant.getLogStatusSuccessName();
                var detail = log_detail_string.getDetailString2(event_tm, 'app_modify', auth, app_text, event, '', status);
                var remark = '';
                var level_id = log_constant.getLogLevelInfoId();
                var event_id = (old_app_id == 0 ? log_constant.getLogEventAddId() : log_constant.getLogEventModifyId());

                log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

                    res.send(resData);
                    return true;
                });

            }
            else {
                app_insert_detail(modify_db, end_index, app_id, app_param, data_list, res);
            }
        }
    })
}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app modify req body: ' + JSON.stringify(req_body));
    }

    var id = req_body.id;
    var text = req_body.text;
    var image = req_body.image;
    var param = req_body.param;
    var group_id = req_body.group_id;
    var status = req_body.status;
    var remark = req_body.remark;

    var hosts = req_body.hosts;

    if (param == undefined) {
        param = '';
    }
    var storage_param = util.generateStorageParam(param);
    if (remark == undefined) {
        remark = '';
    }

    var resData = {};

    if (id < 0 || util.IsEmpty(text) || util.IsEmpty(image) || hosts == undefined || hosts.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '上传的参数错误';
        res.send(resData);
        return false;
    }

    console.log('hosts: ' + JSON.stringify(hosts));
    // 对host做存储转换
    for(var idx=0; idx < hosts.length; idx++) {
        var itemData = hosts[idx];

        var app_full_file = itemData.app_full_file;
        var app_work_path = itemData.app_work_path;

        var storage_app_full_file = util.generateStoragePath(app_full_file);
        var storage_app_work_path = util.generateStoragePath(app_work_path);

        itemData.app_full_file = storage_app_full_file;
        itemData.app_work_path = storage_app_work_path;

        hosts[idx] = itemData;
    }

    console.log('changed hosts: ' + JSON.stringify(hosts));

    if (id > 0) {
        // 修改
        var strUpdateSql = "UPDATE res_app SET ";
        strUpdateSql += "app_text='" + text + "',";
        strUpdateSql += "app_image='" + image + "',";
        strUpdateSql += "group_id=" + group_id + ",";
        strUpdateSql += "status=" + status + ",";
        strUpdateSql += "remark='" + remark + "' ";
        strUpdateSql += "WHERE id=" + id;

        modify_db.modify(strUpdateSql, null, function(err, result){
            if (global.print_log) {
                console.log('reqSql: ' + strUpdateSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '修改失败！错误信息：' + err.message;
                res.send(resData);
                return false;
            }
            else {
                // 修改明细
                var strSql = "SELECT id,app_id,as_id AS host_id,app_full_file,";
                strSql += "app_work_path,app_param,";
                strSql += "remark FROM res_app_map WHERE app_id=";
                strSql += id;

                // 查询历史明细
                db.query(strSql, function(err2, result2, fields){
                    if (global.print_log) {
                        console.log('reqSql: ' + strSql);
                        console.log('result: ' + JSON.stringify(result2));
                    }
                    if (err2) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '修改失败！错误信息：' + err.message;
                        res.send(resData);
                        return false;
                    }
                    else {
                        var list_idx = 0;
                        var list_idy = 0;
                        var delete_list = [];
                        var insert_list = [];

                        var dbdata = result2;
                        // 过期数据
                        for(var idx = 0; idx < dbdata.length; idx++) {
                            var itemData = dbdata[idx];

                            if (!is_exists(itemData.host_id, hosts)) {
                                delete_list[list_idx++] = itemData.id;
                            }
                        }

                        // 新增数据
                        for(var idx = 0; idx < hosts.length; idx++) {
                            var itemData = hosts[idx];
                            var item_rslt = is_compare(itemData, storage_param, dbdata);

                            if (0 == item_rslt.status) {
                                // 增加
                                insert_list[list_idy++] = itemData;
                            }
                            else if (1 == item_rslt.status) {
                                // 修改项
                                delete_list[list_idx++] = item_rslt.id;

                                insert_list[list_idy++] = itemData;
                            }
                            //else if (2 == item_rslt.status) {
                                // 没有变化
                            //}
                        }

                        if (delete_list.length < 1 && insert_list.length < 1) {
                            // 数据没有变化
                            resData[json_key.getStatusKey()] = 1;
                            resData[json_key.getMsgKey()] = '修改成功，数据映射没有变化';
                            res.send(resData);
                            return true;
                        }

                        var strDelSql = "";
                        // 删除过期记录
                        if (delete_list.length > 0) {
                            strDelSql = "DELETE FROM res_app_map WHERE id IN("
                            for(var idx = 0; idx < delete_list.length; idx++) {
                                if (idx > 0) {
                                    strDelSql += ",";
                                }
                                strDelSql += delete_list[idx];
                            }
                            strDelSql += ")";
                        }

                        if (strDelSql.length > 0) {
                            modify_db.delete(strDelSql, function(err3, result3){
                                if (global.print_log) {
                                    console.log('reqSql: ' + strDelSql);
                                    console.log('result: ' + JSON.stringify(result3));
                                }
                                if (err3) {
                                    resData[json_key.getStatusKey()] = 0;
                                    resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err3.message;
                                    res.send(resData);
                                    return false;
                                }
                                else if (insert_list.length > 0) {
                                    // 添加
                                    app_insert_detail(modify_db, 0, id, id, text, storage_param, insert_list, res);
                                    return true;
                                }
                                else {
                                    resData[json_key.getStatusKey()] = 1;
                                    resData[json_key.getMsgKey()] = '修改成功';
                                    res.send(resData);
                                    return true;
                                }
                            })
                        }
                        else {
                            // 添加
                            app_insert_detail(modify_db, 0, id, id, text, storage_param, insert_list, res);
                            return true;
                        }

                    }
                })
            }
        })
    }
    else {
        // 增加
        var strInsertSql = "INSERT INTO res_app (";
        strInsertSql += "app_text,app_image,group_id,status,";
        strInsertSql += "remark) VALUES (";

        strInsertSql += "'" + text + "',";
        strInsertSql += "'" + image + "',";
        strInsertSql += group_id + ",";
        strInsertSql += status + ",";
        strInsertSql += "'" + remark + "')";

        modify_db.insert(strInsertSql, null, function(err, result){
            if (global.print_log) {
                console.log("reqSql: " + strInsertSql);
                console.log("result: " + JSON.stringify(result));
            }
            if (err) {
                resData[json_key.getSizeKey()] = 0;
                resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err.message;
                res.send(resData);
                return false;
            }
            else {
                // 添加详细
                id = result[json_key.getInsertIdKey()];
                app_insert_detail(modify_db, 0, id, 0, text, storage_param, hosts, res);
            }
        })
    }

})

module.exports = router;