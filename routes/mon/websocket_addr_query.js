/**
 * Created by fushou on 2019/9/20.
 */

var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');

router.post('/', function(req, res, next) {
    var resData = {};
    var resDataBody = {};

    var req_body = req.body;

    util.printLog('websocket addr query req body', req_body);

    // Websocket服务端口
    util.getMonPort(function(port){

        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '成功';

        resDataBody[json_key.getPortKey()] = port;

        resData[json_key.getDataKey()] = resDataBody;
        res.send(resData);

    });

});

module.exports = router;