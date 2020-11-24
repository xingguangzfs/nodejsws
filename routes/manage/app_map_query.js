/**
 * Created by fushou on 2019/4/1.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('app map query req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var id = req_body.app_id;

    if (id == undefined || id <= 0) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    var strSql = "SELECT t1.id,t1.app_id,t1.as_id AS host_id,t2.ip_addr AS host_ip,t1.app_full_file,";
    strSql += "t1.app_work_path,t1.app_param,t1.remark FROM res_app_map t1,res_as t2 ";
    strSql += "WHERE t1.app_id=" + id;
    strSql += " AND t1.as_id=t2.id";

    db.query(strSql, function(err, result, fields){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '请求失败，错误信息： ' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '请求成功';
            resData[json_key.getTotalCountKey()] = result.length;

            //console.log('app map: ' + JSON.stringify(result));

            // 修正app值
            for(var idx=0; idx<result.length; idx++) {
                var itemData = result[idx];

                var app_full_file = itemData.app_full_file;
                var app_work_path = itemData.app_work_path;
                var app_param = itemData.app_param;

                itemData.app_full_file = util.parseStoragePath(app_full_file);
                itemData.app_work_path = util.parseStoragePath(app_work_path);
                itemData.app_param = util.parseStorageParam(app_param);

                result[idx] = itemData;
            }

            //console.log('change app map: ' + JSON.stringify(result));

            resData[json_key.getListKey()] = result;
        }
        res.send(resData);
    })

})

module.exports = router;
