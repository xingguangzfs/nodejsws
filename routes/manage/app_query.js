/**
 * Created by fushou on 2018/5/22.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');
var util = require('../../common/util');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('app query req body: ' + JSON.stringify(req_body));
    }

    var id = req_body.id;

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

    var strSqlMaxs = '';
    var strSql = '';
    var resData = {};

    var statusKey = json_key.getStatusKey();
    var msgKey = json_key.getMsgKey();

    // 获取组信息
    var strSqlGroup = "SELECT id,name FROM res_app_group ORDER BY id ASC";

    // 查询最大个数
    strSqlMaxs = 'SELECT COUNT(*) AS max_count FROM res_app';

    // 查询记录
    strSql = 'SELECT id,app_text,app_image,group_id,status,remark FROM res_app';

    // 查询条件
    if (id != undefined && id > 0) {
        strSqlMaxs += ' WHERE id=' + id;
        strSql += ' WHERE id=' + id;
    }

    // 添加分页限制
    var select_offset = (page_index - 1) * page_size;
    var select_count = page_size * page_count;
    strSql += " limit " + select_offset + ',' + select_count;

    // 查询用户组信息
    db.query(strSqlGroup, function(err, groups, fields) {
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
            // 查询最大数
            db.query(strSqlMaxs, function(err2, maxs, fields){
                if (global.print_log) {
                    console.log('reqSql: ' + strSqlMaxs);
                    console.log('result: ' + JSON.stringify(maxs));
                }

                var max_count = 0;
                if (err2) {
                }
                else {
                    max_count = maxs[0].max_count;
                }

                // 查询记录数
                db.query(strSql, function(err3, result, fields){
                    if (global.print_log) {
                        console.log('reqSql: ' + JSON.stringify(strSql));
                        console.log('result: ' + JSON.stringify(result));
                    }
                    if (err3) {
                        resData[json_key.getStatusKey()] = 0;
                        resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err3.message;
                    }
                    else {
                        var app_list = [];
                        for(var idx = 0; idx < result.length; idx++) {
                            var item_pt = result[idx];
                            var itemData = {};
                            itemData[json_key.getIdKey()] = item_pt.id;
                            itemData[json_key.getTextKey()] = item_pt.app_text;
                            itemData[json_key.getIconKey()] = item_pt.app_image;
                            itemData[json_key.getGroupIdKey()] = item_pt.group_id;
                            itemData[json_key.getStatusKey()] = item_pt.status;
                            itemData[json_key.getRemarkKey()] = item_pt.remark;

                            if (itemData.group_id == 0) {
                                itemData['group_name'] = '';
                            }
                            else {
                                itemData['group_name'] = util.GetGroupName(itemData.group_id, groups);
                            }

                            app_list[idx] = itemData;
                        }

                        var listKey = json_key.getListKey();
                        resData[statusKey] = 1;
                        resData[msgKey] = '查询成功';
                        resData[json_key.getMaxCountKey()] = max_count;
                        resData[json_key.getTotalCountKey()] = app_list.length;
                        resData[listKey] = app_list;
                    }
                    res.send(resData);
                });
            });
        }
    })

})

module.exports = router;