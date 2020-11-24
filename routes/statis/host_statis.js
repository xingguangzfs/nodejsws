/**
 * Created by fushou on 2019/12/13.
 */
/**
 * Created by fushou on 2019/10/28.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');
var statis_base = require('./statis_base');

router.post('/', function(req, res, next) {
    var resData = {};

    var req_body = req.body;

    util.printLog('host statis query req body', req_body);

    var cycle_id = req_body.cycle_id;
    var begin_tm = req_body.begin_tm;
    var end_tm = req_body.end_tm;

    if (cycle_id == undefined || cycle_id == null || cycle_id <= 0) {
        cycle_id = 1;
    }

    var db_name = statis_base.getStatisDbName('statis_as', cycle_id);

    var strMaxSql = "SELECT COUNT(*) AS max_count FROM " + db_name;

    var strSql = "SELECT id,ip_addr,cycle_id,";
    strSql += "DATE_FORMAT(cycle_tm, '%Y-%m-%d %H:%i:%s') AS cycle_tm,";
    strSql += "DATE_FORMAT(begin_tm, '%Y-%m-%d %H:%i:%s') AS begin_tm,";
    strSql += "DATE_FORMAT(end_tm, '%Y-%m-%d %H:%i:%s') AS end_tm,";
    strSql += "online_count,offline_count,user_count,app_count,app_inst_count,";
    strSql += "remark FROM ";
    strSql += db_name;
    strSql += " WHERE begin_tm >='" + begin_tm + "' ";
    strSql += "AND end_tm <= '" + end_tm + "' ";
    strSql += "AND cycle_id=" + cycle_id;
    strSql += " ORDER BY begin_tm ASC";

    db.query(strMaxSql, function(errMax, resultMax){
        var max_count = 0;
        if (!errMax && resultMax.length > 0) {
            max_count = resultMax[0].max_count;
        }

        db.query(strSql, function(err, result){
            util.printLog('strSql', strSql);
            util.printLog('result', result);

            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '查询失败，错误消息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                resData[json_key.getMaxCountKey()] = max_count;
                resData[json_key.getCountKey()] = result.length;
                resData[json_key.getListKey()] = result;
            }

            res.send(resData);

        });

    });

});

module.exports = router;