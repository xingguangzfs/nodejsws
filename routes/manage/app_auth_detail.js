/**
 * Created by fushou on 2019/3/7.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('app auth detail query req body: ' + JSON.stringify(req_body));
    }

    var user_ids = req_body.user_ids;

    // 获取记录
    var strSql = "SELECT t1.id,t1.user_id,t2.name AS user_name,";
    strSql += " t1.app_id,t1.x_left,t1.y_left,t1.remark FROM ";
    strSql += " res_app_auth t1, res_user t2 WHERE t1.user_id=t2.id ";

    // 查询条件
    var strCondition = '';
    if (user_ids!= undefined && user_ids.length > 0) {
        strCondition = ' AND t1.user_id IN(';
        for(var idx = 0; idx < user_ids.length; idx++) {
            if (idx > 0) {
                strCondition += ',';
            }
            strCondition += user_ids[idx];
        }

        strCondition += ')';
    }

    if (strCondition.length > 0) {
        strSql += strCondition;
    }

    strSql += ' ORDER BY t1.user_id ASC';

    var resData = {};

    // 查询数据列表
    db.query(strSql, function(err, datasets, fields){
        if (global.print_log) {
            console.log('reqSql: ' + strSql);
            console.log('result: ' + JSON.stringify(datasets));
        }
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err.message;
            res.send(resData);
            return false;
        }
        else {

            if (datasets.length == 0) {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '查询成功！';
                resData[json_key.getTotalCountKey()] = datasets.length;
                resData[json_key.getListKey()] = datasets;
                res.send(resData);
                return true;
            }

            // 查询详细app信息
            //var app_ids = [];

            // 获取 app 编号
            var strAppWhereSql = "(";
            for(var idx = 0; idx < datasets.length; idx++) {
                var itemData = datasets[idx];

                //app_ids[idx] = itemData.app_id;
                if (idx > 0) {
                    strAppWhereSql += ",";
                }
                strAppWhereSql += itemData.app_id;
            }
            strAppWhereSql += ")";

            var strAppSql = "SELECT id,app_text,app_image FROM res_app WHERE id IN ";
            strAppSql += strAppWhereSql;

            db.query(strAppSql, function(err2, result2, fields2){
                if (global.print_log) {
                    console.log('reqSql: ' + strAppSql);
                    console.log('result: ' + JSON.stringify(result2));
                }
                if (err2) {
                    resData[json_key.getStatusKey()] = 0;
                    resData[json_key.getMsgKey()] = '查询失败！错误信息：' + err.message;
                    res.send(resData);
                    return false;
                }
                else {
                    var data_list = [];
                    for(var idx = 0; idx < datasets.length; idx++) {
                        var itemData = datasets[idx];
                        var app_id = itemData.app_id;

                        for(var idy = 0; idy < result2.length; idy++) {
                            var appItemData = result2[idy];

                            if (app_id == appItemData.id) {
                                itemData['app_text'] = appItemData.app_text;
                                itemData['app_image'] = appItemData.app_image;
                                break;
                            }
                        }

                        data_list[idx] = itemData;
                    }

                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '查询成功';
                    resData[json_key.getTotalCountKey()] = data_list.length;
                    resData[json_key.getListKey()] = data_list;

                    res.send(resData);
                }
            })

        }

    });

})

module.exports = router;


