/**
 * Created by fushou on 2020/1/14.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('image_query', req_body);

    // 分页参数
    var page_index = req_body.page_index;
    var page_size = req_body.page_size;
    var page_count = req_body.page_count;

    if (page_index == undefined || page_index < 0) {
        page_index = 0;
    }
    if (page_size == undefined || page_size < 1) {
        page_size = 20;
    }
    if (page_count == undefined || page_count < 1) {
        page_count = 1;
    }

    var strSqlMaxs = "";
    var strSql = "";

    // 查询最大个数
    strSqlMaxs = "SELECT COUNT(*) AS max_count FROM res_image";

    strSql = "SELECT id,rfolder,file_name,text,width,height,size,target,enable,position,remark FROM res_image";

    // 添加分页限制
    var select_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSql += " limit " + select_offset + ',' + select_count;

    db.query(strSqlMaxs, function(errMax, resultMax){
        util.printLog('strSql', strSqlMaxs);
        util.printLog('result', resultMax);

        var max_count = 0;
        if (!errMax && resultMax.length > 0) {
            max_count = resultMax[0].max_count;
        }

        db.query(strSql, function(errIcons, resultIcons){
            util.printLog('strSql', strSql);
            util.printLog('result', resultIcons);

           if (errIcons) {
               resData[json_key.getStatusKey()] = 0;
               resData[json_key.getMsgKey()] = '查询失败，错误信息：' + errIcons.message;
           }
           else {
               resData[json_key.getStatusKey()] = 1;
               resData[json_key.getMaxCountKey()] = max_count;
               resData[json_key.getTotalCountKey()] = resultIcons.length;
               resData[json_key.getListKey()] = resultIcons;
           }
            res.send(resData);
        });
    });
});

module.exports = router;