/**
 * Created by fushou on 2019/10/12.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var child_api = require('../child/child_api');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('host discovery req body', req_body);

    child_api.discoverAsHost(function(err, result){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取失败';
            resData[json_key.getTotalCountKey()] = 0;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取成功';
            resData[json_key.getCountKey()] = result.length;
            resData[json_key.getListKey()] = result;
        }

        res.send(resData);
    });

});

module.exports = router;
