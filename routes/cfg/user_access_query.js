/**
 * Created by fushou on 2019/11/12.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var resData = {}

    var req_body = req.body;

    util.printLog('cfg user access query req body', req_body);

    var item_user_id = req_body.user_id;
    var item_group_id = req_body.group_id;

    if (util.IsEmpty(item_user_id)) {
        item_user_id = 0;
    }

    if (util.IsEmpty(item_group_id)) {
        item_group_id = 0; // 默认用户权限类型
    }

    var strSqlAccess = "SELECT id,name,title,group_id,remark FROM cfg_access_type ";
    strSqlAccess += "WHERE group_id=" + item_group_id;

    var strSqlUserAccess = "SELECT id,user_id,access_ids,remark FROM cfg_user_access ";
    strSqlUserAccess += "WHERE user_id=" + item_user_id;

    var accessList = [];
    var userAccessData = null;

    db.query(strSqlAccess, function(err1, resultAccess){
        util.printLog('strSql', strSqlAccess);
        util.printLog('result', resultAccess);

        if (err1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err1.message;
            res.send(resData);
            return false;
        }
        else if (resultAccess.length == 0) {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getCountKey()] = 0;
            resData[json_key.getDataKey()] = null;
            return true;
        }
        else {
            accessList = resultAccess;

            if (item_user_id == 0) {
                var bodyData = {};
                bodyData[json_key.getAccessKey()] = accessList;
                bodyData[json_key.getUserKey()] = null;

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                resData[json_key.getCountKey()] = accessList.length;
                resData[json_key.getDataKey()] = bodyData;

                res.send(resData);
                return true;
            }

            db.query(strSqlUserAccess, function(err2, resultUserAccess){
                util.printLog('strSql', strSqlUserAccess);
                util.printLog('result', resultUserAccess);

                if (!err2 && resultUserAccess.length > 0) {
                    userAccessData = resultUserAccess[0];
                }

                var bodyData = {};
                bodyData[json_key.getAccessKey()] = accessList;
                bodyData[json_key.getUserKey()] = userAccessData;

                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                resData[json_key.getCountKey()] = accessList.length;
                resData[json_key.getDataKey()] = bodyData;

                res.send(resData);
                return true;
            })
        }
    });
});

module.exports = router;