/**
 * Created by fushou on 2019/5/9.
 */
var util = require('../common/util');
var json_key = require('../common/json_key');
var db = require('../database/mysql_db');
var modify_db = require('../database/modify_mysql_db');
var router_list = require('./router');

function pathUnlessIndexOf(path) {
    var unless_list = router_list.getUnless();

    for(var idx = 0; idx < unless_list.length; idx++) {
        var itemData = unless_list[idx];
        if (path == itemData){
            return idx;
        }
    }
    return -1;
}

function onUpdateSessionLastTime(user_id, user_name) {
    var resData = {};

    var ct = util.getFormatCurTime();

    var strSql = "UPDATE res_user_session SET ";
    strSql += "last_tm='" + ct + "' ";
    strSql += "WHERE user_id=" + user_id;
    strSql += " AND status=1";

    modify_db.modify(strSql, null, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);
        // 无论修改成功与否，都返回成功
        var affectedRows = 0;
        if (err) {
            util.printLog('filter error', err);
        }
        else {
            affectedRows = result[json_key.getAffectedRowsKey()];
        }

        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '成功';
        resData[json_key.getNameKey()] = user_name;
        resData[json_key.getTotalCountKey()] = affectedRows;

        util.printLog('filter res data', resData);

    });
}

function onLoginVerify(token, user_id, user_name, res, next, callback) {
    var strSql = "SELECT status,token FROM res_user_session WHERE ";
    strSql += "user_id=" + user_id

    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log('strSql: ' + strSql);
            console.log('result: ' + JSON.stringify(result));
        }

        /*
        * 返回值说明:
        *   -1: 失败
        *   0: 用户未登录，包括从未登录过和登录过但是当前已经注销
        *   1: 用户已登录
        *   2: 用户重复登录
        * */
        var status = -1;

        if (err) {
            status = -1;
        }
        else if (result.length > 0) {
            // 指定用户存在
            var itemData = result[0];
            var res_token = itemData.token;
            if (res_token == null) {
                res_token = '';
            }
            status = itemData.status;
            if (res_token != token) {
                status = 2;
            }
        }
        else {
            // 指定用户不存在，即用户没有登录过
            status = 0;
        }

        callback(err, status);
    })
}

function filter(req, res, next) {
    var resData = {};

    var token = util.getReqToken(req);

    if (util.IsEmpty(token)) {
        next();
        return true;
    }

    // tokenobj: {"header":{"alg":"HS256","typ":"JWT"},"payload":{"id":2,"name":"test","iat":1557384409,"exp":1557386209},"signature":"Ot2y0xXBcESzok8qFmnWTvHwwmtJDiy9L_BMYrWgl8Q"}
    try {
        var tokenobj = util.decodeToken(token);

        if (util.IsEmpty(tokenobj)) {
            next();
            return true;
        }

        //util.printLog('filter_token_obj', JSON.stringify(tokenobj));

        var payload = tokenobj.payload;

        if (util.IsEmpty(payload)) {
            next();
            return true;
        }

        //util.printLog('filter_token_payload', JSON.stringify(payload));

        var user_id = payload.id;
        var user_name = payload.name;
        var time = payload.time;

        //var iat = payload.iat;
        //var exp = payload.exp;

        // 验证是否重复登录
        onLoginVerify(token, user_id, user_name, res, next, function(err, status){
            if (global.print_log) {
                console.log('filter verify: ' + JSON.stringify(status));
            }
            if (err) {
                util.sendError(res, err);
                return false;
            }
            else if (status == 2) {
                // 重复登录
                resData[json_key.getStatusKey()] = 2;
                resData[json_key.getMsgKey()] = '此用户已经在其它地方登录，当前会话已经失效';
                res.send(resData);
                return false;
            }
            else if (status == 0) {
                // 未登录，或者已经超时

                // 判断是否免验证
                if (pathUnlessIndexOf(req.path) >= 0) {
                    next();
                }
                else {
                    res.sendStatus(401);
                    return false;
                }
            }
            else {
                // 更新最后访问状态
                onUpdateSessionLastTime(user_id, user_name);
                next();
            }
        })

    }
    catch(e) {
        console.log('filter error: ' + e.message);
        //util.sendError(res, err);
        next();
    }
}

var filter = {
    filter: filter
}

module.exports = filter;
