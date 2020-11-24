/**
 * Created by fushou on 2019/11/11.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next){
    var resData = {}

    var req_body = req.body;

    util.printLog('cfg user access modify req body', req_body);

    var item_access_id = req_body.access_id;
    var item_user_id = req_body.user_id;
    var item_user_name = req_body.user_name;
    var item_access_ids = req_body.access_ids;

    var item_str_access_ids = '';

    if (item_access_ids != undefined && item_access_ids != null && item_access_ids.length > 0) {
        item_str_access_ids = JSON.stringify(item_access_ids);
    }

    var item_remark = '';

    if (util.IsEmpty(item_user_id) || item_user_id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    if (item_access_id > 0) {
        var strModifySql = "UPDATE cfg_user_access SET ";
        strModifySql += "access_ids='" + item_str_access_ids + "',";
        strModifySql += "remark='" + item_remark + "' ";
        strModifySql += "WHERE id=" + item_access_id;

        modify_db.modify(strModifySql, null, function(err, resultModify){
            util.printLog('strSql', strModifySql);
            util.printLog('result', resultModify);

            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '修改成功';
                resData[json_key.getIdKey()] = item_access_id;
            }
            res.send(resData);
        });
    }
    else {
        var strInsertSql = "INSERT INTO cfg_user_access (user_id,";
        strInsertSql += "access_ids,remark) VALUES(";
        strInsertSql += item_user_id + ",";
        strInsertSql += "'" + item_str_access_ids + "',";
        strInsertSql += "'" + item_remark + "'";
        strInsertSql += ")";

        modify_db.insert(strInsertSql, null, function(err, resultInsert){
            util.printLog('strSql', strInsertSql);
            util.printLog('result', resultInsert);

            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '添加失败，错误信息：' + err.message;
            }
            else {
                item_access_id = resultInsert[json_key.getInsertIdKey()];

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '添加成功';
                resData[json_key.getIdKey()] = item_access_id;
            }
            res.send(resData);
        })
    }
});

module.exports = router;