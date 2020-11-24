/**
 * Created by fushou on 2019/4/18.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
//var util = require('../../common/util');
var ffi_call = require('../../common/ffi_call');
//var modify_db = require('../../database/modify_mysql_db');

router.get('/', function(req, res, next){
    if (global.print_log) {
        console.log('license gen get!');
    }

    var resData = {};

    var str_code = ffi_call.getClientCode();

    if (str_code.length > 0) {
        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '成功';
        resData[json_key.getDataKey()] = str_code;
    }
    else {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '失败';
    }

    if (global.print_log) {
        console.log('license gen rslt: ' + JSON.stringify(resData));
    }

    res.send(resData);
});

module.exports = router;