/**
 * Created by fushou on 2018/6/22.
 */
var express = require('express');
var router = express.Router();

var path = require('path');
var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next){
    var rslt = {};

    var req_body = req.body;

    if (global.print_log) {
        console.log(req_body);
    }

    var ids = req_body[json_key.getIdKey()];
    if (ids.length < 1) {
        rslt[json_key.getStatusKey()] = 0;
        rslt[json_key.getMsgKey()] = '错误：传递参数无效！';
        res.send(rslt);
        return;
    }

    //var querySql = 'SELECT rfolder, file_name FROM res_image WHERE enable=1 AND ';
    var sql = 'DELETE FROM res_image WHERE enable=1 AND ';
    var whereSql = '(';
    for(var i = 0; i < ids.length; i++) {
        if (i > 0)
            whereSql += ' || ';
        whereSql += 'id=' + ids[i];
    }
    whereSql += ')';

    //querySql += whereSql;
    sql += whereSql;

    if (global.print_log) {
        //console.log(querySql);
        console.log(sql);
    }

    modify_db.delete(sql, function(err, result){
        if (err) {
            rslt[json_key.getStatusKey()] = 0;
            rslt[json_key.getMsgKey()] = '错误：删除数据库记录失败，请重新提交申请！';
            res.send(rslt);
            return;
        }

        // 成功
        rslt[json_key.getStatusKey()] = 1;
        rslt[json_key.getMsgKey()] = '成功：删除资源成功！';
        res.send(rslt);
    });

})

module.exports = router;
