/**
 * Created by fushou on 2019/9/7.
 */

var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('user session query', req_body);

    var strSql = "SELECT id,user_id,user_name,status,client_ip_addr FROM res_user_session";

    db.query(strSql, function(err, result, fields) {
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败';
            res.send(resData);
            return false;
        }

        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '查询成功';
        resData[json_key.getTotalCountKey()] = result.length;
        resData[json_key.getListKey()] = result;

        res.send(resData);
        return true;
    })
});

module.exports = router;
