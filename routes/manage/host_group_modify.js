/**
 * Created by fushou on 2019/2/25.
 */
/**
 * Created by fushou on 2019/1/23.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('host group modify req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var id = req_body.id;
    var name = req_body.name;
    var remark = req_body.remark;

    var strSql = "";
    if (id > 0) {
        // 修改
        strSql = "UPDATE res_as_group SET ";
        strSql += "name='" + name + "',";
        strSql += "remark='" + remark + "'";
        strSql += " WHERE id=" + id;

        modify_db.modify(strSql, function(err, result){
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                console.log(err);

                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '修改失败！错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '修改成功！';
                resData[json_key.getDataKey()] = req_body;
            }
            res.send(resData);
        });
    }
    else {
        // 添加
        strSql = "INSERT INTO res_as_group(name,remark) VALUES(";
        strSql += "'" + name + "',";
        strSql += "'" + remark + "')";

        modify_db.insert(strSql, function(err, result){
            if (global.print_log) {
                console.log('reqSql: ' + strSql);
                console.log('result: ' + JSON.stringify(result));
            }
            if (err) {
                console.log(err);

                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '添加失败！错误信息：' + err.message;
            }
            else {
                resData[json_key.getStatusKey()] = 1;
                resData[json_key.getMsgKey()] = '添加成功！';

                var dataObj = req_body;
                dataObj[json_key.getIdKey()] = result[json_key.getInsertIdKey()];

                resData[json_key.getDataKey()] = dataObj;
            }
            res.send(resData);
        });
    }

});

module.exports = router;

