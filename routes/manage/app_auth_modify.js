/**
 * Created by fushou on 2019/3/5.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

function generate_user_app_map(user_ids, app_list) {
    var list = [];
    var idx = 0;
    for(var i = 0; i < user_ids.length; i++) {
        var user_id = user_ids[i];
        for(var j = 0; j < app_list.length; j++) {
           var appItemData = app_list[j];

            var itemData = {
                user_id: user_id,
                app_id: appItemData.id,
                remark: appItemData.remark
            }
            list[idx++] = itemData;
        }
    }
    return list;
}

function is_exists(itemAuthData, map_list) {
    var status = 0;
    for(var idx = 0; idx < map_list.length; idx++) {
        var itemData = map_list[idx];

        if (itemAuthData.user_id == itemData.user_id && itemAuthData.app_id == itemData.app_id) {
            status = 1;
            break;
        }
    }
    return status;
}

function is_compare(mapItemData, auth_list) {
    //var status = 0;
    var rslt = {
        status: 0
    };
    for(var idx = 0; idx < auth_list.length; idx++) {
        var authItemData = auth_list[idx];
        if (mapItemData.user_id == authItemData.user_id &&
            mapItemData.app_id == authItemData.app_id) {
            if (mapItemData.remark == authItemData.remark) {
                //status = 2;
                rslt['status'] = 2;
            }
            else {
                //status = 1;
                rslt['status'] = 1;
                rslt['id'] = authItemData.id;
            }
            break;
        }
    }
    return rslt;
}

function recursion_modify(modify_db, start_index, data_list) {
    /*
     UPDATE res_app_auth
     SET app_id = CASE id
     WHEN 1 THEN 3
     WHEN 2 THEN 4
     END,
     app_text = CASE id
     WHEN 1 THEN '画图'
     WHEN 2 THEN '记事本'
     END,
     app_image = CASE id
     WHEN 1 THEN ''
     WHEN 2 THEN ''
     END,
     remark = CASE id
     WHEN 1 THEN ''
     WHEN 2 THEN ''
     END
     WHERE id IN (1,2)
     */
    var resData = {};

    var max_count = 10;
    var end_index = (start_index + max_count) < data_list.length ? (start_index + max_count) : data_list.length;
    if (end_index <= start_index) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        return resData;
    }

    var strAppIdSql = "";
    var strAppTextSql = "";
    var strAppImageSql = "";
    var strRemarkSql = "";
    var strWhereSql = "";

    var strModifySql = "UPDATE res_app_auth SET ";

    strAppIdSql += "app_id = CASE id ";
    strAppTextSql += "app_text = CASE id ";
    strAppImageSql += "app_image = CASE id ";
    strRemarkSql += "remark = CASE id ";

    strWhereSql += "WHERE id IN (";
    for(var idx = start_index; idx < end_index; idx++) {
        var itemData = data_list[idx];

        var item_id = itemData.id;
        var item_user_id = itemData.user_id;
        var item_app_id = itemData.app_id;
        var item_app_remark = itemData.remark;

        strAppIdSql += "WHEN " + item_id + " THEN " + item_app_id + " ";
        strRemarkSql += "WHEN " + item_id + " THEN '" + item_app_remark + "' ";

        if (idx > 0) {
            strWhereSql += ",";
        }
        strWhereSql += item_id;
    }

    strAppIdSql += "END";
    strAppTextSql += "END";
    strAppImageSql += "END";
    strRemarkSql += "END";

    strWhereSql += ")";

    strModifySql += strAppIdSql;
    strModifySql += ", " + strAppTextSql;
    strModifySql += ", " + strAppImageSql;
    strModifySql += ", " + strRemarkSql;
    strModifySql += " " + strWhereSql;

    modify_db.modify(strModifySql, function(err, result){
        if (global.print_log) {
            console.log('reqSql: ' + strModifySql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '错误消息: ' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        return resData;
    });
}

function recursion_insert(modify_db, start_index, data_list, res) {
    var resData = {};

    var max_count = 10;
    var end_index = (start_index + max_count) < data_list.length ? (start_index + max_count) : data_list.length;
    if (end_index <= start_index) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
        //return resData;
    }
    var strInsertSql = "INSERT INTO res_app_auth (";
    strInsertSql += "user_id,app_id,remark";
    strInsertSql += ") VALUES ";
    for(var idx = start_index; idx < end_index; idx++) {
        var itemData = data_list[idx];

        var itemSql = "";

        if (idx > start_index) {
            itemSql += ",";
        }

        itemSql += "(";
        itemSql += itemData.user_id + ",";
        itemSql += itemData.app_id + ",";
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
            //return resData;
        }
        else {
            // 递归
            if (end_index >= data_list.length) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '执行成功';
                res.send(resData);
                return true;
                //return resData;
            }
            else {
                recursion_insert(modify_db, end_index, data_list, res);
            }
        }
    })
}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app auth modify req body: ' + JSON.stringify(req_body));
    }

    var user_ids = req_body.user_ids;
    var app_list = req_body.app_list;

    var resData = {};
    if (user_ids == undefined || user_ids.length < 1
        || app_list == undefined || app_list.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误，用户编号或者应用列表不能为空';
        res.send(resData);
        return false;
    }

    // 查询用户旧记录
    var strQuerySql = "SELECT id,user_id,app_id,remark FROM res_app_auth";

    strQuerySql += " WHERE user_id IN (";
    for(var i = 0; i < user_ids.length; i++) {
        if (i > 0) {
            strQuerySql += ",";
        }
        strQuerySql += user_ids[i];
    }
    strQuerySql += " )";
    strQuerySql += " ORDER BY user_id";

    db.query(strQuerySql, function(err, datasets, fields){
        if (global.print_log) {
            console.log('reqSql: ' + strQuerySql);
            console.log('result: ' + JSON.stringify(datasets));
        }

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err.message;
            res.send(resData);
        }
        else {
            var delete_list = [];
            var insert_list = [];

            var map_list = generate_user_app_map(user_ids, app_list);

            var idx = 0;
            var idz = 0;
            // 查找过期数据
            for(var x = 0; x < datasets.length; x++) {
                var itemData = datasets[x];

                var status = is_exists(itemData, map_list);
                if (0 == status) {
                    // 不存在
                    delete_list[idx++] = itemData.id;
                }
            }

            // 构造修改或增加数据
            for(var y = 0; y < map_list.length; y++) {
                var itemMapData = map_list[y];
                var item_rslt = is_compare(itemMapData, datasets);
                if (0 == item_rslt.status) {
                    // 增加
                    insert_list[idz++] = itemMapData;
                }
                else if (1 == item_rslt.status) {
                    // 有变化，
                    // 删除旧项
                    delete_list[idx++] = item_rslt.id;
                    // 添加新项
                    insert_list[idz++] = itemMapData;
                }
                //else if (2 == status) {
                    // 已经存在，跳过
                //}
            }

            if (delete_list.length < 1 && insert_list.length < 1) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                res.send(resData);
                return true;
            }

            var strDelSql = "";
            // 删除过期记录
            if (delete_list.length > 0) {
                strDelSql = "DELETE FROM res_app_auth WHERE id IN("
                for(var idx = 0; idx < delete_list.length; idx++) {
                    if (idx > 0) {
                        strDelSql += ",";
                    }
                    strDelSql += delete_list[idx];
                }
                strDelSql += ")";
            }

            if (strDelSql.length > 0) {
                // 删除数据
                modify_db.insert(strDelSql, function(err2, result) {
                    if (global.print_log) {
                        console.log('reqSql: ' + strDelSql);
                        console.log('result: ' + JSON.stringify(result));
                    }
                    if (err2) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err2.message;
                        res.send(resData);
                        return false;
                    }
                    else if (insert_list.length > 0) {
                        // 添加数据
                        recursion_insert(modify_db, 0, insert_list, res);
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
                recursion_insert(modify_db, 0, insert_list, res);
                return true;
            }

        }

    })

})

module.exports = router;
