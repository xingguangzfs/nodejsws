/**
 * Created by fushou on 2019/2/20.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;
    if (global.print_log) {
        console.log('host group query req body: ' + JSON.stringify(req_body));
    }

    var status = req_body.status;

    var resData = {};

    var strSql = "SELECT id,name,remark FROM res_as_group";

    var strCountSql = "SELECT group_id, COUNT(*) AS count FROM res_as";

    if (status >= 0) {
        strCountSql += " WHERE status=" + status;
    }

    strCountSql += " GROUP BY group_id";

    // 查询组个数
    db.query(strCountSql, function(err, result, fields){
        if (global.print_log) {
            console.log('reqSql: ' + strCountSql);
            console.log('result: ' + JSON.stringify(result));
        }
        var group_list = [];
        if (!err) {
            group_list = result;
        }

        // 查询数据列表
        db.query(strSql, function(err2, result2, fields2){
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result2));
            }
            if (err2) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '请求失败!，错误信息：' + err;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '请求成功';

                var data_list = [];
                for(var idx = 0; idx < result2.length; idx++) {
                    var itemData = result2[idx];
                    itemData[json_key.getCountKey()] = util.getGroupDataCount(itemData.id, group_list);

                    data_list[idx] = itemData;
                }

                resData[json_key.getTotalCountKey()] = data_list.length;
                resData[json_key.getListKey()] = data_list;
            }
            res.send(resData);

        })
    })

});

module.exports = router;
