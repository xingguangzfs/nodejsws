/**
 * Created by fushou on 2019/4/2.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    util.printLog('user app query req body', req_body);

    var resData = {};

    var user_id = req_body.user_id;

    if (user_id == undefined || user_id <= 0) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);
        return false;
    }

    // 查询授权给用户的应用列表

    // 根据用户编号，查找授权主机所包含的应用信息
    // SELECT id,app_text,app_image,remark FROM res_app WHERE status=1 AND id IN ((SELECT DISTINCT app_id FROM res_app_map WHERE host_id IN (SELECT host_id FROM res_host_auth WHERE user_id=2)))

    // SELECT t1.id,t1.user_id,t1.app_id,t2.app_text,t2.app_image,t2.status,t2.remark FROM res_app_auth t1, res_app t2 WHERE t1.user_id=2 AND t1.app_id=t2.id
    var strSql = "SELECT t1.id,t1.user_id,t1.app_id,t1.x_left,t1.y_left,";
    strSql += "t2.app_text,t2.app_image,t2.remark ";
    strSql += " FROM res_app_auth t1, res_app t2 ";
    strSql += " WHERE t1.user_id=" + user_id;
    strSql += " AND t1.app_id=t2.id ";
    strSql += " ORDER BY t1.x_left ASC, t1.y_left ASC";

    // 查询用户授权应用信息
    db.query(strSql, function(err, result, fields){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询用户应用列表失败，错误信息： ' + err.message;
            res.send(resData);
            return false;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '查询成功';
            resData[json_key.getTotalCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
            res.send(resData);
            return true;
        }
    });

})

module.exports = router;
