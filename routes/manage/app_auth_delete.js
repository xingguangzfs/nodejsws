/**
 * Created by fushou on 2019/3/8.
 */
/**
 * Created by fushou on 2019/2/20.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app auth delete req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var user_id = req_body.user_id;

    if (user_id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误，编号无效';
        res.send(resData);
        return;
    }
    else {
        var strSql = "DELETE FROM res_app_auth WHERE user_id=" + user_id;

        modify_db.insert(strSql, function(err, result) {
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败！错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '删除成功！';

                var dataObj = req_body;
                resData[json_key.getDataKey()] = dataObj;
            }
            res.send(resData);
        });
    }

});

module.exports = router;

