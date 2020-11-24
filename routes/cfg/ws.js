/**
 * Created by fushou on 2019/7/19.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    util.printLog('cfg ws req body', req_body);

    var fields = req_body.fields;

    if (fields == undefined || fields == null || fields.length < 1) {
        fields = ['user_cores','max_timeout'];
    }

    var resData = {};

    var strSql = "SELECT ";

    for(var idx = 0; idx < fields.length; idx++) {
        if (idx > 0) {
            strSql += ",";
        }

        strSql += fields[idx];
    }

    strSql += " FROM cfg_ws";
    strSql += " LIMIT 1";

    db.query(strSql, function(err, result, outfields){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getTotalCountKey()] = outfields.length;
            resData[json_key.getDataKey()] = result[0];
        }

        res.send(resData);
    });

});

module.exports = router;
