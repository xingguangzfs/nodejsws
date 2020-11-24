/**
 * Created by fushou on 2019/6/19.
 */
var express = require('express');
var router = express.Router();
var util = require('../common/util');
var json_key = require('../common/json_key');
var modify_db = require('../database/modify_mysql_db');

var child_api = require('./child/child_api');

function update_user_tm(uid, uname, res) {
    var resData = {};

    var ct = util.getFormatCurTime();

    var strSql = "UPDATE res_user_session SET ";
    strSql += "last_tm='" + ct + "' ";
    strSql += "WHERE user_id=" + uid;
    strSql += " AND status=1";

    modify_db.modify(strSql, null, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);
        // 无论修改成功与否，都返回成功
        var affectedRows = 0;
        if (err) {
            util.printLog('heart error', err);
        }
        else {
            affectedRows = result[json_key.getAffectedRowsKey()];
        }

        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '成功';
        resData[json_key.getNameKey()] = uname;
        resData[json_key.getTotalCountKey()] = affectedRows;

        util.printLog('heart res data', resData);

        res.send(resData);
    });
}

function get_history_user_active(uname, res) {
    var resData = {};

    var itemData = util.GetCacheValue(uname);
    var count = 1;
    if (!util.IsEmpty(itemData)) {
        count = itemData[json_key.getCountKey()];
        if (util.IsEmpty(count)) {
            count = 0;
        }
        else if (count > 0) {
            // 允许超时三分钟
            var cur_tm = process.uptime(); // 精度毫秒，返回值例如3.963秒
            var last_tm = itemData[json_key.getTimeKey()];

            var diff_tm = cur_tm - last_tm;
            if (diff_tm >= (3 * 60)) {
                count = 0;
            }
        }
    }

    resData[json_key.getStatusKey()] = 1;
    resData[json_key.getMsgKey()] = '成功';
    resData[json_key.getNameKey()] = uname;
    resData[json_key.getTotalCountKey()] = count;

    util.printLog('heart res data', resData);

    res.send(resData);
}

router.get('/', function(req, res, next) {
    var req_param = req.query;

    util.printLog('heart req param', req_param);

    var resData = {};

    var uid = req_param[json_key.getIdKey()];
    var uname = req_param[json_key.getNameKey()];
    var urole = req_param[json_key.getRoleKey()];
    if (uname == undefined || uname == null || uname=='') {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return true;
    }

    update_user_tm(uid, uname, res);

});

module.exports = router;