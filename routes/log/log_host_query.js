/**
 * Created by fushou on 2019/10/9.
 */

var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var resData = {};

    var req_body = req.body;

    util.printLog('log host query req body', req_body);

    var key = req_body.key;
    var start_date = req_body.start_date;
    var end_date = req_body.end_date;
    var level = req_body.level;
    var event = req_body.event;

    var page_index = req_body.page_index; // 页序号，从1开始
    var page_size = req_body.page_size; // 每页的数据记录条数
    var page_count = req_body.page_count; // 请求的页面个数

    if (util.IsEmpty(page_index)) {
        page_index = 1;
    }
    if (util.IsEmpty(page_size)) {
        page_size = 20;
    }
    if (util.IsEmpty(page_count)) {
        page_count = 1;
    }

    var strMaxCountSql = "SELECT COUNT(*) AS max_count FROM log_as t1, log_level t2 ";
    strMaxCountSql += "WHERE t1.level_id=t2.id ";

    var strSql = "SELECT t1.id,t1.level_id,t2.name AS level_name,t1.event_id,";
    strSql += "TRIM(BOTH '\"' FROM t1.source) AS source,";
    strSql += "DATE_FORMAT(t1.event_tm,'%Y-%m-%d %H:%i:%s') AS event_tm,";
    strSql += "DATE_FORMAT(t1.record_tm,'%Y-%m-%d %H:%i:%s') AS record_tm,";
    strSql += "t1.info,t1.remark FROM log_as t1, log_level t2 ";
    strSql += "WHERE t1.level_id=t2.id ";

    var strWhereSql = "";
    if (level != undefined && level != null && level.length > 0) {
        strWhereSql += " AND t1.level_id IN (";

        for(var idx = 0; idx < level.length; idx++) {
            if (idx > 0) {
                strWhereSql += ",";
            }
            strWhereSql += level[idx];
        }

        strWhereSql += ") ";
    }

    if (event != undefined && event != null && event.length > 0) {
        strWhereSql += " AND t1.event_id IN (";

        for(var idx = 0; idx < event.length; idx++) {
            if (idx > 0) {
                strWhereSql += ",";
            }
            strWhereSql += event[idx];
        }

        strWhereSql += ") ";
    }

    if (!util.IsEmpty(start_date) && !util.IsEmpty(end_date)) {
        strWhereSql += " AND (";
        strWhereSql += "t1.event_tm >= '" + start_date + "' && ";
        strWhereSql += "t1.event_tm <= '" + end_date + "'";
        strWhereSql += ") "
    }
    else if (!util.IsEmpty(start_date)) {
        strWhereSql += " AND t1.event_tm >= '" + start_date + "' ";
    }
    else if (!util.IsEmpty(end_date)) {
        strWhereSql += " AND t1.event_tm <= '" + end_date + "' ";
    }

    if (!util.IsEmpty(key)) {
        strWhereSql += " AND t1.info LIKE '%" + key + "%' ";
    }

    if (!util.IsEmpty(key)) {
        strWhereSql += " AND t1.info LIKE '%" + key + "%' ";
    }

    // 查询总个数，不包含分页条件
    strMaxCountSql += strWhereSql;

    // 分页
    var offset_index = (page_index - 1) * page_size;
    var page_row = page_size * page_count;

    // 排序
    strWhereSql += " ORDER BY event_tm DESC,id";

    // 分页
    strWhereSql += " LIMIT " + offset_index;
    strWhereSql += "," + page_row;

    // 查询记录数
    strSql += strWhereSql;

    db.query(strMaxCountSql, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);
        if (err || result.length < 1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询错误，错误信息：' + err.message;
            res.send(resData);
            return false;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getMaxCountKey()] = result[0].max_count;

            if (result.length < 1) {
                res.send(resData);
                return true;
            }
            else {
                db.query(strSql, function(err2, result2){
                    util.printLog('strSql', strSql);
                    util.printLog('result', result2);

                    if (err2) {
                        resData[json_key.getCountKey()] = 0;
                        resData[json_key.getListKey()] = null;
                    }
                    else {
                        resData[json_key.getCountKey()] = result2.length;
                        resData[json_key.getListKey()] = result2;
                    }

                    res.send(resData);
                })
            }
        }

    });

});

module.exports = router;

