/**
 * Created by fushou on 2019/10/9.
 */

var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('log user detail req body', req_body);

    var item_id = req_body.id;

    if (item_id == undefined || item_id == null || item_id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    var strSql = "SELECT id,level_id,event_id,";
    strSql += "TRIM(BOTH '\"' FROM source) AS source,";
    strSql += "DATE_FORMAT(event_tm,'%Y-%m-%d %H:%i:%s') AS event_tm,";
    strSql += "DATE_FORMAT(record_tm,'%Y-%m-%d %H:%i:%s') AS record_tm,";
    strSql += "user_name,info,detail,remark";
    strSql += " FROM log_user WHERE id=" + item_id;

    db.query(strSql, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err.message;
            res.send(resData);
            return false;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
            res.send(resData);
            return true;
        }

    });

});

module.exports = router;
