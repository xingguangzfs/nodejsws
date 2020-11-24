/**
 * Created by fushou on 2019/9/27.
 */

var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var resData = {};

    var req_body = req.body;

    util.printLog('log event query req body', req_body);

    var min = req_body.min;
    var max = req_body.max;

    if (min == undefined) {
        min = 1;
    }
    if (max == undefined) {
        max = 100;
    }

    var strSql = "SELECT id,name FROM log_event";
    strSql += " WHERE id >=" + min;
    strSql += " AND id <=" + max;

    db.query(strSql, function(err, result){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询错误，错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }

        res.send(resData);

    });

});

module.exports = router;
