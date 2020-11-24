/**
 * Created by fushou on 2019/9/7.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var child_api = require('../child/child_api');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('app inst query req body', req_body);

    var exe_file_name = req_body[json_key.getNameKey()];
    var file_desc = req_body[json_key.getDescKey()];
    var file_size = req_body[json_key.getSizeKey()];

    if (util.IsEmpty(exe_file_name)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);
        return false;
    }

    if (util.IsEmpty(file_desc)) {
        file_desc = '';
    }

    if (util.IsEmpty(file_size)) {
        file_size = 0;
    }

    child_api.getAppInst(exe_file_name, file_desc, file_size, function(err, result) {
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '请求失败';
        }
        else {
           util.printLog('app inst query getAppInst result', result);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '请求成功';
            resData[json_key.getTotalCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }

        res.send(resData);
        return true;
    });
});

module.exports = router;
