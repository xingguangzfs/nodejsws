/**
 * Created by fushou on 2019/11/9.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('cfg access type modify req body', req_body);

    var item_id = req_body.id;
    var item_is_delete = req_body.is_delete;

    var item_name = '';
    var item_title = '';
    var item_group_id = 0;
    var item_remark = '';

    if (item_id == undefined) {
        item_id = 0;
    }

    if (!item_is_delete) {
        item_name = req_body.name;
        item_title = req_body.title;
        item_group_id = req_body.group_id;
        item_remark = req_body.remark;
    }

    if ((item_is_delete && util.IsEmpty(item_id)) || (!item_is_delete && util.IsEmpty(item_name))) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    if (util.IsEmpty(item_title)) {
        item_title = item_name;
    }

    if (item_group_id == undefined || item_group_id == null) {
        item_group_id = 0;
    }

    if (item_remark == undefined || item_remark == null) {
        item_remark = '';
    }

    var strModifySql = "";
    if (item_is_delete) {
        strModifySql += "DELETE FROM cfg_access_type WHERE id=" + item_id;
    }
    else if (item_id > 0) {
        strModifySql += "UPDATE cfg_access_type SET ";
        strModifySql += "name='" + item_name + "',";
        strModifySql += "title='" + item_title + "',";
        strModifySql += "group_id=" + item_group_id + ",";
        strModifySql += "remark='" + item_remark + "' ";
        strModifySql += "WHERE id=" + item_id;
    }
    else {
        // 添加
        strModifySql += "INSERT INTO cfg_access_type (";
        strModifySql += "name,title,group_id,remark) VALUES(";
        strModifySql += "'" + item_name + "',";
        strModifySql += "'" + item_title + "',";
        strModifySql += item_group_id + ",";
        strModifySql += "'" + item_remark + "'";
        strModifySql += ")";
    }

    modify_db.modify(strModifySql, null, function(err, result){
        util.printLog('strSql', strModifySql);
        util.printLog('result', result);
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;

            if (item_id > 0) {
                if (item_is_delete) {
                    resData[json_key.getMsgKey()] = '删除成功';
                }
                else {
                    resData[json_key.getMsgKey()] = '修改成功';
                }
            }
            else {
                resData[json_key.getMsgKey()] = '添加成功';
            }
        }
        res.send(resData);
    })

});

module.exports = router;