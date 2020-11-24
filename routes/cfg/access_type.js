/**
 * Created by fushou on 2019/11/8.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('cfg access type req body', req_body);

    var group_id = req_body.group_id;
    var page_index = req_body.page_index;
    var page_size = req_body.page_size;
    var page_count = req_body.page_count;

    if (util.IsEmpty(page_index)) {
        page_index = 1;
    }
    if (util.IsEmpty(page_size)) {
        page_size = 20;
    }
    if (util.IsEmpty(page_count)) {
        page_count = 1;
    }


    var strMaxSql = "";
    strMaxSql += "SELECT COUNT(*) AS max_count FROM cfg_access_type ";

    var strSql = "";
    strSql += "SELECT id,name,title,group_id,remark FROM ";
    strSql += "cfg_access_type ";

    var strWhereSql = "";
    if (group_id != undefined && group_id != null && group_id > 0) {
        strWhereSql += "WHERE group_id=" + group_id;
    }

    if (strWhereSql.length > 0) {
        strMaxSql += strWhereSql;
        strSql += strWhereSql;
    }

    // 添加分页限制
    var select_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSql += " limit " + select_offset + ',' + select_count;

    db.query(strMaxSql, function(err, result){
        util.printLog('strSql', strMaxSql);
        util.printLog('result', result);

        var max_count = 0;
        if (!err && result.length > 0) {
            max_count = result[0].max_count;
        }

        db.query(strSql, function(err2, result2){
            util.printLog('strSql', strSql);
            util.printLog('result', result2);

            if (err2) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '失败';
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                resData[json_key.getMaxCountKey()] = max_count;
                resData[json_key.getCountKey()] = result2.length;
                resData[json_key.getListKey()] = result2;
            }
            res.send(resData);
        });
    });
});

module.exports = router;