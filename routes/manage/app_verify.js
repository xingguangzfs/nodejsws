/**
 * Created by fushou on 2018/6/13.
 */
var express = require('express');
var router = express.Router();

var url = require('url');
var qs = require('querystring');

var db = require('../../database/mysql_db');
var json_key = require('../../common/json_key');

router.post('/', function(req, res, next){
    var req_body = req.body;

    if (global.print_log) {
        console.log('app verfiy req body: ' + JSON.stringify(req_body));
    }

    //var args = url.parse(req.url).query;
    //var item_name = qs.parse(args)['item_name'];
    //console.log(item_name);
    var resData = {};

    var item_id = req_body.id;
    var item_text = req_body.text;

    if (item_id == undefined || item_id < 0) {
        item_id = 0;
    }

    if (item_text == undefined || item_text=="" || item_text == null || item_text.length < 1) {
        resData[statusKey] = 0;
        resData[msgKey] = '请求参数错误!';
        res.send(resData);
        return false;
    }

    var strSql = "SELECT id FROM res_app WHERE app_text='" + item_text + "' ";
    if (item_id > 0) {
        strSql += "AND id != " + item_id;
    }

    var statusKey = json_key.getStatusKey();
    var msgKey = json_key.getMsgKey();

    db.query(strSql, function(err, result ,fields) {
        if (global.print_log) {
            console.log('reqSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }

        if (!err) {
            if (result.length > 0) {
                resData[statusKey] = 0;
                resData[msgKey] = '验证失败，名称已经存在';
            }
            else {
                resData[statusKey] = 1;
                resData[msgKey] = '验证成功';
            }
        }
        else {
            resData[statusKey] = 0;
            resData[msgKey] = '验证失败';
        }

        res.send(resData);
    })

})

module.exports = router;
