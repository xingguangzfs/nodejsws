/**
 * Created by fushou on 2019/3/25.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;
    if (global.print_log) {
        console.log(JSON.stringify(req_body));
    }

    var resData = {};

    var strSql = "SELECT id,app_text,app_full_file,app_image,app_work_path,app_param,remark FROM res_def_app";

    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log('reqSql: ' + strSql)
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getTotalCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }
        res.send(resData);
    });

});

module.exports = router;