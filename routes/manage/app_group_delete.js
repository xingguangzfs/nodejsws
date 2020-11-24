/**
 * Created by fushou on 2019/2/25.
 */
/**
 * Created by fushou on 2019/2/25.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app group delete req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var group_id = req_body.id;

    if (group_id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误，编号无效';
        res.send(resData);
        return;
    }
    else {
        var strSql = "DELETE FROM res_app_group WHERE id=" + group_id;

        var strAppSql = "UPDATE res_app SET group_id=0 WHERE group_id=" + group_id;

        modify_db.delete(strSql, function(err, result) {
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败！错误信息：' + err.message;
                res.send(resData);
            }
            else {

                modify_db.modify(strAppSql, null, function(err2, result2){
                    if (global.print_log) {
                        console.log('reqSql: ' + strAppSql);
                        console.log('result: ' + JSON.stringify(result2));
                    }
                    resData[json_key.getStatusKey()] = 1;
                    if (err2) {
                        resData[json_key.getMsgKey()] = '更新连带信息失败！错误信息：' + err2.message;
                    }
                    else {
                        resData[json_key.getMsgKey()] = '删除成功！';
                    }
                    var dataObj = req_body;
                    resData[json_key.getDataKey()] = dataObj;
                    res.send(resData);
                })

            }

        });
    }

});

module.exports = router;

