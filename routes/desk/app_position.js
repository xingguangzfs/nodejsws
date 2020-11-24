/**
 * Created by fushou on 2018/7/5.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next) {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }

    var rslt = {};
    var statusKey = json_key.getStatusKey();
    var msgKey = json_key.getMsgKey();

    var req_body = req.body;
    var item_id = req_body.item_id;
    var x_left = req_body.x_left;
    var y_top = req_body.y_top;

    if (item_id == 0) {
        rslt[statusKey] = 0;
        rslt[msgKey] = '失败，参数错误！';
        util.SendNormalResMsg(res, 200, rslt);
        return;
    }

    var sql = 'UPDATE res_app SET ';
    sql += 'x_left=' + x_left + ',';
    sql += 'y_top=' + y_top;
    sql += ' WHERE id=' + item_id;

    if (global.print_log) {
        console.log(sql);
    }

    modify_db.modify(sql, function(err, result){
        if (err) {
            console.log(err);

            rslt[statusKey] = 0;
            rslt[msgKey] = '修改失败！错误信息：' + err.message;
        }
        else {
            rslt[statusKey] = 1;
            rslt[msgKey] = '修改成功！';
        }
        console.log(JSON.stringify(rslt));

        util.SendNormalResMsg(res, 200, rslt);
    });

});

module.exports = router;