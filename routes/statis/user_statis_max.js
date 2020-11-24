/**
 * Created by fushou on 2019/11/7.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var statis_key = require('./statis_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    var max_count = req_body.max_count;
    if (max_count == undefined || max_count == '' || max_count <= 0) {
        max_count = 5;
    }

    util.printLog('user statis max query req body', req_body);

    // SELECT tb1.id,tb1.user_id,tb1.user_name,ROUND((NOW() - tb1.login_tm),2) AS inline_tm FROM res_user_session tb1 WHERE tb1.weight>0 AND tb1.status=1 ORDER BY inline_tm DESC LIMIT 3
    var strSql = "";
    strSql += "SELECT tb1.id,tb1.user_id,tb1.user_name,";
    strSql += "ROUND((NOW()-tb1.login_tm),2) AS inline_tm ";
    strSql += "FROM res_user_session tb1 WHERE tb1.weight>0 ";
    strSql += "AND tb1.status=1 ";
    strSql += "ORDER BY inline_tm DESC ";
    strSql += "LIMIT " + max_count;

    db.query(strSql, function(err, result){
       util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败';
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }
        res.send(resData);
    });
});

module.exports = router;