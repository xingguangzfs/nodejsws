/**
 * Created by fushou on 2019/11/9.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {}

    var req_body = req.body;

    util.printLog('cfg access type name verify req body', req_body);

    var item_name = req_body.name;

    if (util.IsEmpty(item_name)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    var strSql = "";
    strSql += "SELECT id FROM cfg_access_type WHERE name='" + item_name + "'";

    db.query(strSql, function(err, result){
       util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err.message;
        }
        else {
            var item_id = 0;
            if (result.length > 0) {
                item_id = result[0].id;
            }

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getCountKey()] = result.length;
            resData[json_key.getIdKey()] = item_id;
        }

        res.send(resData);
    });
});

module.exports = router;