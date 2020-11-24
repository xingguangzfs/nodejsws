/**
 * Created by fushou on 2019/1/24.
 */
/**
 * Created by fushou on 2019/1/24.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('user name verify req body: ' + JSON.stringify(req_body));
    }

    var user_id = req_body.id;
    var user_name = req_body.name;

    var strSql = "";

    strSql += "SELECT id FROM res_user WHERE "
    strSql += "name='" + user_name + "'";
    if (user_id > 0) {
        strSql += " AND id != " + user_id;
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
