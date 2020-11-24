/**
 * Created by fushou on 2019/10/17.
 */
/**
 * Created by fushou on 2019/10/12.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('../child/child_api');

function onFindId(history_user, user_name) {
    for(var idx = 0; idx < history_user.length; idx++) {
        var itemData = history_user[idx];

        var item_id = itemData.id;
        var item_name = itemData.name;

        if (user_name == item_name) {
            return item_id;
        }
    }

    return 0;
}

function onFindItem(history_hosts, id) {
    for(var idx = 0; idx < history_hosts.length; idx++) {
        var itemData = history_hosts[idx];

        var item_id = itemData.id;
        if (id == item_id) {
            return itemData;
        }
    }
    return null;
}

function onUpdateUsers(history_users, new_users, res) {
    var resData = {};

    var total_count = new_users.length;
    var modify_count = 0;
    var insert_count = 0;

    var modify_arr = [];
    var add_arr = [];
    var remark = '批量添加';
    var status = 1;

    for (var idx = 0; idx < new_users.length; idx++) {
        var itemData = new_users[idx];

        var item_name = itemData.name;

        var id = onFindId(history_users, item_name);
        if (id > 0) {
            // 已经存在则更新
            itemData.id = id;
            modify_arr.push(itemData);
        }
        else {
            // 不存在则添加
            add_arr.push(itemData);
        }
    }

    // 修改
    if (modify_arr.length > 0) {
        for(var idx = 0; idx < modify_arr.length; idx++) {
            var itemData = modify_arr[idx];

            var item_id = itemData.id;
            var item_name = itemData.name;
            var item_alias = itemData.alias;
            var item_pswd = itemData.pswd;

            var strSql = "UPDATE res_user SET ";
            strSql += "alias='" + item_alias + "',";
            strSql += "pswd='" + item_pswd + "',";
            strSql += "group_id=0,weight=1,";
            strSql += "status=" + status + ",";
            strSql += "remark='" + remark + "' ";
            strSql += "WHERE id=" + item_id;

            modify_db.modify(strSql, null, function(err, result){
                util.printLog('strSql', strSql);
                util.printLog('result', result);

                if (!err) {
                    modify_count++;

                    // 修改AS用户
                    child_api.changeUser(item_name, status, null);
                    /*var userItemData = onFindItem(history_users, item_id);
                    if (userItemData != null) {
                        var history_item_status = userItemData.status;
                        var history_item_name = userItemData.name;
                        if (history_item_status != status) {
                            child_api.changeUser(history_item_name, status, null);
                        }
                    }*/
                }
            });
        }
    }

    // 添加
    if (add_arr.length > 0) {
        var group_id = 0;
        var weight = 1;
        for(var idx = 0; idx < add_arr.length; idx++) {
            var itemData = add_arr[idx];

            var item_name = itemData.name;
            var item_alias = itemData.alias;
            var item_pswd = itemData.pswd;

            var strSql = "INSERT INTO res_user(name,alias,pswd,";
            strSql += "group_id,weight,status,remark) VALUES(";
            strSql += "'" + item_name + "',";
            strSql += "'" + item_alias + "',";
            strSql += "'" + item_pswd + "',";
            strSql += group_id + ",";
            strSql += weight + ",";
            strSql += status + ",";
            strSql += "'" + remark + "')";

            modify_db.insert(strSql, null, function(err, result){
                util.printLog('strSql', strSql);
                util.printLog('result', result);
                if (!err) {
                    insert_count++;

                    child_api.addUser(item_name, status, null);
                }
            });
        }
    }

    // 发送应答
    resData[json_key.getStatusKey()] = 1;
    resData[json_key.getMsgKey()] = '修改成功';
    resData[json_key.getTotalCountKey()] = total_count;
    resData[json_key.getIncreateCountKey()] = insert_count;
    resData[json_key.getModifyCountKey()] = modify_count;

    res.send(resData);
}

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('user batch modify req body', req_body);

    var datas = req_body.users;

    if (datas == undefined || datas.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);

        return false;
    }

    var strSql = "SELECT id,name,alias,pswd,status FROM res_user";

    db.query(strSql, function(err, result){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            res.send(resData);
            return false;
        }
        else {
            onUpdateUsers(result, datas, res);
        }
    });

    //resData[json_key.getStatusKey()] = 1;
    //resData[json_key.getMsgKey()] = '修改成功';

    //res.send(resData);
});

module.exports = router;