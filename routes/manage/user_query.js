/**
 * Created by fushou on 2019/1/23.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('user query req body: ' + JSON.stringify(req_body));
    }

    // 关键词
    var keyboard = req_body.keyboard;
    if (keyboard == undefined) {
        keyboard = '';
    }

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

    // 获取用户组信息
    var strSqlGroup = "SELECT id,name FROM res_user_group ORDER BY id ASC";

    // 获取用户最大数
    var strSqlMaxs = "SELECT COUNT(*) AS max_count FROM res_user";

    // 获取用户
    var strSqlUser = "SELECT id,name,alias,pswd,group_id,weight,status,remark FROM res_user";

    // 查询条件
    var strCondition = '';

    if (strCondition.length > 0) {
        strSqlMaxs += strCondition;
        strSqlUser += strCondition;
    }

    // 添加分页限制
    var select_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSqlUser += " limit " + select_offset + ',' + select_count;

    var resData = {};
    // 查询用户组信息
    db.query(strSqlGroup, function(err, groups, fields){
        if (global.print_log) {
            console.log('reqSql: ' + strSqlGroup);
            console.log('result: ' + JSON.stringify(groups));
        }

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err.message;
            res.send(resData);
        }
        else {

            // 查询最大记录数
            db.query(strSqlMaxs, function(err2, maxs, fields2){
                if (global.print_log) {
                    console.log('reqSql: ' + strSqlMaxs);
                    console.log('result: ' + JSON.stringify(maxs));
                }
                var max_count = 0;
                if (!err2) {
                    max_count = maxs[0].max_count;
                }

                // 查询数据列表
                db.query(strSqlUser, function(err3, users, fields3){
                    if (global.print_log) {
                        console.log('reqSql: ' + strSqlUser);
                        console.log('result: ' + JSON.stringify(users));
                    }
                    if (err3) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err3.message;
                    }
                    else {
                        resData[json_key.getStatusKey()] = 1;
                        resData[json_key.getMsgKey()] = '查询成功！';
                        resData[json_key.getMaxCountKey()] = max_count;
                        resData[json_key.getTotalCountKey()] = users.length;

                        // 添加一个 group_name 项
                        var datas = [];
                        for(var idx = 0; idx < users.length; idx++) {
                            var itemData = users[idx];
                            if (itemData.group_id == 0) {
                                itemData['group_name'] = '';
                            }
                            else {
                                itemData['group_name'] = util.GetGroupName(itemData.group_id, groups);
                            }

                            datas[idx] = itemData;
                        }
                        resData[json_key.getListKey()] = datas;
                    }
                    res.send(resData);
                });

            });

        }

    });
});

module.exports = router;
