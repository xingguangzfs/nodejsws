/**
 * Created by fushou on 2019/2/20.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('host ip verify req body: ' + JSON.stringify(req_body));
    }

    var host_id = req_body.id;
    var host_ip_addr = req_body.ip_addr;

    var strSql = "";

    strSql += "SELECT id FROM res_as WHERE "
    strSql += "ip_addr='" + host_ip_addr + "'";
    if (host_id > 0) {
        strSql += " AND id != " + host_id;
    }

    var resData = {};
    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log('reqSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功！';
            resData[json_key.getTotalCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }

        res.send(resData);
    });
});

module.exports = router;