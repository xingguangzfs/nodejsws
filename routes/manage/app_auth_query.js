/**
 * Created by fushou on 2019/3/5.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app auth query req body: ' + JSON.stringify(req_body));
    }

    var user_ids = req_body.user_ids;

    // 请求页相关
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

    var strMaxSql = "SELECT t1.user_id,t2.name AS user_name FROM res_app_auth t1, res_user t2 WHERE t1.user_id=t2.id ";
    // 获取记录
    // SELECT t1.user_id,t2.name AS user_name, COUNT(*) AS app_count FROM res_user_auth t1, res_user t2 WHERE t1.user_id=t2.id GROUP BY t1.user_id
    //var strSql = "SELECT id,user_id,app_text,app_name,app_image,x_left,y_left,remark FROM res_app_auth";
    var strSql = "SELECT t1.user_id,t2.name AS user_name, COUNT(*) AS app_count FROM ";
    strSql += "res_app_auth t1, res_user t2 WHERE t1.user_id=t2.id ";

    // 查询条件
    var strCondition = '';
    if (user_ids!= undefined && user_ids.length > 0) {
        strCondition = ' AND t1.user_id IN(';
        for(var idx = 0; idx < user_ids.length; idx++) {
            if (idx > 0) {
                strCondition += ',';
            }
            strCondition += user_ids[idx];
        }

        strCondition += ')';
    }

    if (strCondition.length > 0) {
        strMaxSql += strCondition;
        strSql += strCondition;
    }

    strMaxSql += ' GROUP BY t1.user_id';
    strSql += ' GROUP BY t1.user_id';

    // 添加分页限制
    var select_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSql += " limit " + select_offset + ',' + select_count;

    var resData = {};

    // 查询数据列表
    db.query(strMaxSql, function(err, result, fields){
        util.printLog('strSql', strMaxSql);
        util.printLog('result', result);

        var max_count = 0;
        if (!err) {
            max_count = result.length;
        }

        db.query(strSql, function(err2, result2, fields2){
            if (err2) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err2.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                resData[json_key.getMaxCountKey()] = max_count;
                resData[json_key.getTotalCountKey()] = result2.length;
                resData[json_key.getListKey()] = result2;
            }
            res.send(resData);
        })

    });

})

module.exports = router;

