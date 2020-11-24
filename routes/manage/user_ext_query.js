/**
 * Created by fushou on 2019/4/15.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('user ext query req body: ' + JSON.stringify(req_body));
    }

    var user_id = req_body.user_id;
    var ext_list = req_body.ext_list;

    var resData = {};

    if (user_id == undefined || user_id < 1 ||
        ext_list == undefined || ext_list.length < 1) {

        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);

        return false;
    }

    var strSql = 'SELECT ';
    for(var idx = 0; idx < ext_list.length; idx++) {
        var itemData = ext_list[idx];

        if (idx > 0) {
            strSql += ',';
        }

        strSql += itemData.name;
    }

    strSql += ' FROM res_user ';
    strSql += 'WHERE id=' + user_id;

    db.query(strSql, function(err, result, fields){
       if (global.print_log) {
           console.log('strSql: ' + strSql);
           console.log('result: ' + JSON.stringify(result));
       }
       if (err) {
           resData[json_key.getStatusKey()] = 0;
           resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err.message;
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
