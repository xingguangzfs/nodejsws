/**
 * Created by fushou on 2019/2/27.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app simple query req body: ' + JSON.stringify(req_body));
    }

    var group_id = req_body.group_id;
    var status = req_body.status;

    var page_index = req_body.page_index;
    var page_size = req_body.page_size;
    var page_count = req_body.page_count;

    if (page_index == undefined || page_index < 0) {
        page_index = 1;
    }
    if (page_size == undefined || page_size < 1) {
        page_size = 100;
    }
    if (page_count == undefined || page_count < 1) {
        page_count = 1;
    }

    // 获取用户最大数
    var strSqlMaxs = "SELECT COUNT(*) AS max_count FROM res_app";

    // 获取用户
    var strSqlUser = "SELECT id,app_text,app_image,status,remark FROM res_app";

    // 查询条件
    var strCondition = '';

    if (group_id != undefined && group_id >= 0) {
        strCondition += ' WHERE group_id=' + group_id;
    }

    if (status >= 0) {
        if (strCondition.length > 0) {
            strCondition += " AND status=" + status;
        }
        else {
            strCondition += " WHERE status=" + status;
        }
    }

    if (strCondition.length > 0) {
        strSqlMaxs += strCondition;
        strSqlUser += strCondition;
    }

    // 添加分页限制
    var page_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSqlUser += " limit " + page_offset + ',' + select_count;

    var resData = {};

    // 查询最大记录数
    db.query(strSqlMaxs, function(err1, maxs, fields2){
        if (global.print_log) {
            console.log('reqSql: ' + strSqlMaxs);
            console.log('result: ' + JSON.stringify(maxs));
        }
        var max_count = 0;
        if (!err1) {
            max_count = maxs[0].max_count;
        }

        // 查询数据列表
        db.query(strSqlUser, function(err2, users, fields3){
            if (global.print_log) {
                console.log('reqSql: ' + strSqlUser);
                console.log('result: ' + JSON.stringify(users));
            }
            if (err2) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err2.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '查询成功！';
                resData[json_key.getMaxCountKey()] = max_count;
                resData[json_key.getTotalCountKey()] = users.length;

                resData[json_key.getListKey()] = users;
            }
            res.send(resData);
        });

    });

})

module.exports = router;
