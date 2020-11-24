/**
 * Created by fushou on 2019/4/10.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('theme query req body: ' + JSON.stringify(req_body));
    }

    var user_id = req_body.user_id;

    if (user_id == undefined || user_id < 0) {
        user_id = 0;
    }

    var resData = {};

    var strSql = "SELECT id,rfolder,file_name,text,user_id,remark FROM res_theme ";
    if (user_id > 0) {
        strSql += "WHERE user_id=0 OR user_id=" + user_id;
    }
    strSql += " ORDER BY user_id ASC";

    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log("strSql: " + strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询错误，错误消息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getTotalCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }

        res.send(resData);
    })

    //res.send(req_body);
});

module.exports = router;
