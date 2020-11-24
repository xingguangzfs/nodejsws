/**
 * Created by fushou on 2019/12/6.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('statis cycle query req body', req_body);

    var strSql = "SELECT id,name,title,times,remark FROM statis_cycle";

    db.query(strSql, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err.message;
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