/**
 * Created by fushou on 2019/10/11.
 */

var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('../child/child_api');

function onAddFilter(name, desc, size, icon, res) {
    var resData = {};

    var strWhereSql = "image_name='" + name + "' ";

    if (desc != undefined && desc != '' && desc.length > 0) {
        strWhereSql += " AND file_desc='" + desc + "' ";
    }
    strWhereSql += " AND file_size=" + size;

    var strSqlQuery = "SELECT id FROM cfg_app_black WHERE ";
    strSqlQuery += strWhereSql;

    var strSqlInsert = "INSERT INTO cfg_app_black";
    strSqlInsert += "(image_name,file_desc,file_size,icon) VALUES(";
    strSqlInsert += "'" + name + "',";
    strSqlInsert += "'" + desc + "',";
    strSqlInsert += size + ",";
    strSqlInsert += "'" + icon + "'";
    strSqlInsert += ")";

    var strSqlModify = "UPDATE cfg_app_black SET ";
    strSqlModify += "icon='" + icon + "' ";
    strSqlModify += "WHERE ";

    db.query(strSqlQuery, function(err1, result1){
       util.printLog('strSql', strSqlQuery);
        util.printLog('result', result1);

        if (err1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '添加失败';
            res.send(resData);
            return false;
        }
        else {
            if (result1.length > 0) {
                // 修改
                var item_id = result1[0].id;

                strSqlModify += " id=" + item_id;

                modify_db.modify(strSqlModify, null, function(err2, result2){
                    util.printLog('strSql', strSqlModify);
                    util.printLog('result', result2);
                    if (err2) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '添加失败';
                        res.send(resData);
                        return false;
                    }
                    else {
                        resData[json_key.getStatusKey()] = 1;
                        resData[json_key.getMsgKey()] = '添加成功';

                        var dataObj = {};
                        dataObj[json_key.getNameKey()] = name;
                        dataObj[json_key.getTextKey()] = desc;
                        dataObj[json_key.getSizeKey()] = size;
                        dataObj[json_key.getIconKey()] = icon;
                        dataObj[json_key.getIdKey()] = item_id;

                        resData[json_key.getDataKey()] = dataObj;

                        // 通知CC
                        child_api.changeMonAppFilter(name, desc, size, 1, function(err4, result4){
                            util.printLog('app_filter changeMonAppFilter add result', result4);

                            res.send(resData);
                            return true;
                        });

                    }
                });
            }
            else {
                // 插入
                modify_db.insert(strSqlInsert, null, function(err3, result3){
                    util.printLog('strSql', strSqlInsert);
                    util.printLog('result', result3);
                    if (err3) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '添加失败';
                        res.send(resData);
                        return false;
                    }
                    else {
                        resData[json_key.getStatusKey()] = 1;
                        resData[json_key.getMsgKey()] = '添加成功';

                        var dataObj = {};
                        dataObj[json_key.getNameKey()] = name;
                        dataObj[json_key.getTextKey()] = desc;
                        dataObj[json_key.getSizeKey()] = size;
                        dataObj[json_key.getIconKey()] = icon;
                        dataObj[json_key.getIdKey()] = result3[json_key.getInsertIdKey()];

                        resData[json_key.getDataKey()] = dataObj;

                        // 通知CC
                        child_api.changeMonAppFilter(name, desc, size, 1, function(err5, result5){
                            util.printLog('app_filter changeMonAppFilter add result', result5);

                            res.send(resData);
                            return true;

                        })

                    }
                });
            }
        }
    });
}

function onDeleteFilter(name, desc, size, res) {
    var resData = {};

    var strSql = "DELETE FROM cfg_app_black WHERE ";
    strSql += "image_name='" + name + "' ";

    if (desc != undefined && desc != '' && desc.length > 0) {
        strSql += " AND file_desc='" + desc + "' ";
    }

    strSql += " AND file_size=" + size;

    modify_db.delete(strSql, function(err, result){
       util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '删除错误，错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '删除成功';

            // 通知CC
            child_api.changeMonAppFilter(name, desc, size, 0, function(err2, result2){
                util.printLog('app_filter changeMonAppFilter delete result', result2);

                res.send(resData);
            })
        }

    });
}

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('app filter req body', req_body);

    var item_name = req_body.name;
    var item_desc = req_body.desc; // 描述可以为空
    var item_size = req_body.size;
    var item_icon = req_body.icon;
    var item_status = req_body.status;

    if (item_desc == undefined) {
        item_desc = '';
    }

    if (item_icon == undefined) {
        item_icon = '';
    }

    if (util.IsEmpty(item_name) || item_size == undefined) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数无效';
        res.send(resData);
        return false;
    }

    if (item_status == 1) {
        // 添加
        onAddFilter(item_name, item_desc, item_size, item_icon, res);
    }
    else {
        // 删除
        onDeleteFilter(item_name, item_desc, item_size, res);
    }

});

module.exports = router;
