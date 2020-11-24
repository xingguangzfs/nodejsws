/**
 * Created by fushou on 2019/4/2.
 */
/**
 * Created by fushou on 2019/2/22.
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
        console.log('host group name verify req body: ' + JSON.stringify(req_body));
    }

    var id = req_body.id;
    var name = req_body.name;

    var strSql = "";

    strSql += "SELECT id FROM res_as_group WHERE "
    strSql += "name='" + name + "'";
    if (id > 0) {
        strSql += " AND id != " + id;
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
            if (result.length > 0) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '名称已经存在';
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '验证成功';
            }
        }

        res.send(resData);
    });
});

module.exports = router;

