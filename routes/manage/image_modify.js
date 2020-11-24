/**
 * Created by fushou on 2020/1/14.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next){
    var resData = {}

    var req_body = req.body;

    util.printLog('image_modify', req_body);

    var item_id = req_body.id;
    var item_text = req_body.text;
    var item_status = req_body.status;

    if (util.IsEmpty(item_id) || item_id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);

        return;
    }

    if (item_status != 0 && item_status != 1) {
        item_status = 1;
    }

    var strModifySql = "UPDATE res_image SET ";
    strModifySql += "text='" + item_text + "',";
    strModifySql += "enable=" + item_status;
    strModifySql += " WHERE id=" + item_id;

    modify_db.modify(strModifySql, null, function(err, result){
        util.printLog('strSql', strModifySql);
        util.printLog('result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败，错误信息：' + err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        res.send(resData);
    });

});

module.exports = router;