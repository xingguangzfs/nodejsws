/**
 * Created by fushou on 2019/9/6.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

function onFindAppFullFileValue(list, app_id) {
    var value = '';
    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        if (app_id == itemData.app_id) {
            value = itemData.app_full_file;
        }
    }
    return value;
}

function onFindFileName(str) {
    // 查找 .exe
    var key1 = '.exe';
    var key2 = '\\';
    var key3 = '/';
    // 把字符串转换为小写字母
    var strTemp = str.toLowerCase();

    var pos1 = strTemp.indexOf(key1);
    if (pos1 < 0) {
        return null;
    }

    var key_len = 0;
    var strTemp2 = strTemp.substring(0, pos1 + key1.length);

    key_len = key2.length;
    var pos2 = strTemp2.lastIndexOf(key2);
    if (pos2 < 0) {
        pos2 = strTemp2.lastIndexOf(key3);
        key_len = key3.length;
    }
    if (pos2 < 0) {
        return null;
    }

    var value = strTemp2.substr(pos2 + key_len);
    return value;
}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    util.printLog('app ext query', req_body);

    var status = req_body.status;

    var page_index = req_body.page_index;
    var page_offset = req_body.page_offset;
    var page_size = req_body.page_size;
    var page_count = req_body.page_count;

    if (page_offset == undefined || page_offset < 0) {
        page_offset = 0;
    }
    if (page_size == undefined || page_size < 1) {
        page_size = 100;
    }
    if (page_count == undefined || page_count < 1) {
        page_count = 1;
    }

    // 应用详细信息查询
    var strSql1 = "SELECT id,app_id,app_full_file FROM res_app_map";
    strSql1 += " GROUP BY app_full_file";

    // 应用信息查询
    var strSql2 = "SELECT id,app_text,app_image,status,remark FROM res_app";

    if (status >= 0) {
        strSql2 += " WHERE status=" + status;
    }

    // 添加分页限制
    var select_count = page_size * page_count;
    strSql2 += " limit " + page_offset + ',' + select_count;

    var resData = {};

    db.query(strSql1, function(err1, result1, fields1){
        util.printLog('strSql', strSql1);
        util.printLog('result', result1);
        if (err1) {
            util.printLog('app ext query sql error', err1.message);
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取数据发生错误';
            res.send(resData);
            return false;
        }
        else if (result1.length == 1) {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getTotalCountKey()] = 0;
            resData[json_key.getListKey()] = [];
            res.send(resData);
            return true;
        }

        // 查询应用信息
        db.query(strSql2, function(err2, result2, fields2){
            util.printLog('strSql', strSql2);
            util.printLog('result', result2);
            if (err2) {
                util.printLog('app ext query sql error', err2.message);
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '获取数据发生错误';
                res.send(resData);
                return false;
            }
            else if (result2.length == 0) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '成功';
                resData[json_key.getTotalCountKey()] = 0;
                resData[json_key.getListKey()] = [];
                res.send(resData);
                return true;
            }

            // 组织数据
            var resDataList = [];
            for(var idx = 0; idx < result2.length; idx++) {
                var itemData = result2[idx];

                var app_full_file = onFindAppFullFileValue(result1, itemData.id);
                var file_name = onFindFileName(app_full_file);
                if (file_name == null) {
                    continue;
                }

                itemData[json_key.getAppNameKey()] = file_name;

                resDataList.push(itemData);
            }

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getTotalCountKey()] = resDataList.length;
            resData[json_key.getListKey()] = resDataList;
            res.send(resData);

            return true;

        });
    });

});

module.exports = router;