/**
 * Created by fushou on 2019/11/8.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

function onGetUserAccessItem(user_id, user_access_list) {
    if (user_access_list == undefined || user_access_list == null) {
        return null;
    }
    var count = user_access_list.length;
    for(var idx = 0; idx < count; idx++) {
        var itemData = user_access_list[idx];
        var item_user_id = itemData.user_id;

        if (user_id == item_user_id) {
            return itemData;
        }
    }

    return null;
}

router.post('/', function(req, res, next){
    var resData = {}

    var req_body = req.body;

    util.printLog('cfg user access req body', req_body);

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

    // 获取用户最大数
    var strSqlMaxs = "SELECT COUNT(*) AS max_count FROM res_user WHERE status=1 AND weight>0";

    // 获取所有用户列表
    var strSqlUser = "SELECT id,name FROM res_user WHERE status=1 AND weight>0";

    // 用户访问权限
    var strSqlUserAccess = "SELECT id,user_id,access_ids FROM cfg_user_access";

    // 访问权限
    var strSqlAccess = "SELECT id,name,title FROM cfg_access_type WHERE group_id=0";

    // 添加分页限制
    var select_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSqlUser += " limit " + select_offset + ',' + select_count;

    // 最大个数
    db.query(strSqlMaxs, function(err1, resultMax){
        util.printLog('strSql', strSqlMaxs);
        util.printLog('result', resultMax);

        var max_count = 0;
        var count = 0;
        var userList = [];
        var accessList = [];

        if (!err1 && resultMax.length > 0) {
            max_count = resultMax[0].max_count;
        }

        if (max_count == 0) {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getMaxCountKey()] = max_count;
            resData[json_key.getCountKey()] = count;
            res.send(resData);
            return false;
        }

        // 用户访问权限
        db.query(strSqlUserAccess, function(err2, resultUserAccess){
            util.printLog('strSql', strSqlUserAccess);
            util.printLog('result', resultUserAccess);

            var userAccessList = null;
            if (!err2 && resultUserAccess.length > 0) {
                userAccessList = resultUserAccess;
            }

            // 用户列表
            db.query(strSqlUser, function(err3, resultUsers){
               util.printLog('strSql', strSqlUser);
                util.printLog('result', resultUsers);

                if (err3) {
                    resData[json_key.getStatusKey()] = 0;
                    resData[json_key.getMsgKey()] = '查询失败，错误信息：' + err3.message;

                    res.send(resData);
                    return false;
                }
                else if (resultUsers.length == 0) {
                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '成功';
                    resData[json_key.getMaxCountKey()] = max_count;
                    resData[json_key.getCountKey()] = 0;
                    resData[json_key.getDataKey()] = null;

                    res.send(resData);
                    return true;
                }
                else {
                    // 合并用户权限
                    for(var idx = 0; idx < resultUsers.length; idx++) {
                        var itemData = resultUsers[idx];

                        var item_id = itemData.id;

                        var itemUserAccess = onGetUserAccessItem(item_id, userAccessList);

                        itemData[json_key.getAccessIdKey()] = itemUserAccess ? itemUserAccess.id : 0;
                        itemData[json_key.getAccessIdsKey()] = itemUserAccess ? itemUserAccess.access_ids : null;

                        userList.push(itemData);
                    }
                }

                // 访问权限列表
                db.query(strSqlAccess, function(err4, resultAccess){
                    util.printLog('strSql', strSqlAccess);
                    util.printLog('result', resultAccess);

                    if (!err4 && resultAccess.length > 0) {
                        accessList = resultAccess;
                    }

                    var bodyData = {};
                    bodyData[json_key.getUserKey()] = userList;
                    bodyData[json_key.getAccessKey()] = accessList;

                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '成功';
                    resData[json_key.getMaxCountKey()] = max_count;
                    resData[json_key.getCountKey()] = userList.length;
                    resData[json_key.getDataKey()] = bodyData;
                    res.send(resData);
                });

            });
        });

    });

});

module.exports = router;