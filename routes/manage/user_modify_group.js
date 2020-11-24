/**
 * Created by fushou on 2019/3/19.
 */
/**
 * Created by fushou on 2019/1/23.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('user modify group req body: ' + JSON.stringify(req_body));
    }

    var ids = req_body.ids;
    var group_id = req_body.group_id;

    var resData = {};

    var strSql = "";
    if (ids == undefined || ids.length < 1 ||
        group_id == undefined || group_id < 0) {

        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    // 修改
    strSql = "UPDATE res_user SET ";
    strSql += "group_id=" + group_id + " ";
    strSql += " WHERE id IN (";
    for(var idx = 0; idx < ids.length; idx++) {
        if (idx > 0) {
            strSql += ",";
        }
        strSql += ids[idx];
    }
    strSql += ")";

    modify_db.modify(strSql, function(err, result){
        if (global.print_log) {
            console.log('reqSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            console.log(err);

            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败！错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功！';
            resData[json_key.getDataKey()] = req_body;
        }
        res.send(resData);
    });

});

module.exports = router;
