/**
 * Created by fushou on 2019/6/21.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var cc_task = require('../net/cc_task');

function mon_user_active(res) {
    var resData = {};

    cc_task.getUserActive(null, function(err ,data){
        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = err.message;
        }
        else {
            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '成功';
            resData[json_key.getTotalCountKey()] = data.length;
            resData[json_key.getListKey()] = data;
        }

        util.printLog('mon data res data', resData);

        res.send(resData);

    });
}

router.get('/', function(req, res, next){
    var req_params = req.query;

    util.printLog('mon data get', req_params);

    var is_user_active = req_params.is_user_active;

    var resData = {};

    if (is_user_active) {
        mon_user_active(res);
    }
    else {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数无效';
        res.send(resData);
    }
});

/* POST home page. */
router.post('/', function(req, res, next) {
    var req_body = req.body;

    util.printLog('mon data post', req_body);

    var is_user_active = req_body.is_user_active;

    var resData = {};

    if (is_user_active) {
        mon_user_active(res);
    }
    else {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数无效';
        res.send(resData);
    }
});

module.exports = router;
