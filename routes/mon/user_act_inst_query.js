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

    util.printLog('user act inst query', req_body);

    var user_name = req_body[json_key.getNameKey()];

    if (util.IsEmpty(user_name)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        res.send(resData);
        return false;
    }

    child_api.getUserActInst(user_name, function(err, result){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '请求失败';
        }
        else {
            util.printLog('user act inst query getUserActInst result', result);

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