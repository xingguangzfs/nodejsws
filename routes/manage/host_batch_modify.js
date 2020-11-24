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

function onFindId(history_hosts, host_ip) {
    for(var idx = 0; idx < history_hosts.length; idx++) {
        var itemData = history_hosts[idx];

        var item_id = itemData.id;
        var item_ip = itemData.ip_addr;

        if (host_ip == item_ip) {
            return item_id;
        }
    }

    return 0;
}

function onInsertHost(itemData, callback) {

    if (itemData != null) {
        var item_name = itemData.name;
        var item_ip = itemData.ip;
        var item_status = itemData.status;
        var item_group_id = itemData.group_id;
        var item_remark = itemData.remark;

        var strSql = "INSERT INTO res_as(name,ip_addr,status,";
        strSql += "group_id,remark) VALUES(";
        strSql += "'" + item_name + "',";
        strSql += "'" + item_ip + "',";
        strSql += item_status + ",";
        strSql += item_group_id + ",";
        strSql += "'" + item_remark + "')";

        modify_db.insert(strSql, null, function(err, result){
            util.printLog('strSql', strSql);
            util.printLog('result', result);
            if (!err) {
                child_api.addAsHost(item_ip, item_status, function(err2, result2){
                    if (callback) {
                        callback(1);
                    }
                    return true;
                });
            }
            else {
                if (callback) {
                    callback(0);
                }
                return true;
            }
        });
    }
    else {
        if (callback) {
            callback(0);
        }
        return true;
    }
}

function onUpdateHosts(history_hosts, new_hosts, res) {
    var resData = {};

    var add_arr = [];
    var insert_count = 0;

    for (var idx = 0; idx < new_hosts.length; idx++) {
        var itemData = new_hosts[idx];

        var item_name = itemData.name;
        var item_ip = itemData.ip;

        var id = onFindId(history_hosts, item_ip);
        if (id == 0) {
            // 不存在则添加
            add_arr.push(itemData);
        }
    }

    // 添加
    if (add_arr.length > 0) {
        for(var idx = 0; idx < add_arr.length; idx++) {
            var itemData = add_arr[idx];
            onInsertHost(itemData, function(status){
                if (status == 1) {
                    insert_count += 1;
                }
            });
        }

        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '修改成功';
        res.send(resData);
        return true;
    }
    else {
        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '修改成功';
        res.send(resData);
        return true;
    }
}

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    // {"hosts":[{"id":"1","name":"as3","ip":"192.168.0.24"},{"id":"2","name":"as4","ip":"192.168.0.25"},{"id":"3","name":"as5","ip":"192.168.0.26"}],"time":1571034564578}
    util.printLog('host batch modify req body', req_body);

    var hosts = req_body.hosts;

    if (hosts == undefined || hosts.length < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);

        return false;
    }

    var strSql = "SELECT id,name,ip_addr,status FROM res_as";

    db.query(strSql, function(err, result){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            res.send(resData);
            return false;
        }
        else {
            onUpdateHosts(result, hosts, res);
        }
    });

    //resData[json_key.getStatusKey()] = 1;
    //resData[json_key.getMsgKey()] = '修改成功';

    //res.send(resData);
});

module.exports = router;