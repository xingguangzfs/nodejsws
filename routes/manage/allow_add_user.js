/**
 * Created by fushou on 2019/4/25.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.get('/', function(req, res, next){
    if (global.print_log) {
        console.log('allow add use request!');
    }

    var resData = {};

    var max_count = util.getLicenseCount();
    if (max_count > 0) {

        var strSql = "SELECT COUNT(*) AS count FROM res_user WHERE weight > 0";

        db.query(strSql, function(err, result, fields){
            if (global.print_log) {
                console.log('strSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '发生错误，错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';

                var count = result[0].count;
                var enable = count >= max_count ? 0 : 1;
                resData[json_key.getEnableKey()] = enable;
            }
            res.send(resData);
        })
    }
    else {
        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '成功';
        resData[json_key.getEnableKey()] = 1;
        res.send(resData);
    }

});

module.exports = router;
