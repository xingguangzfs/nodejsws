/**
 * Created by fushou on 2019/2/19.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var modify_db = require('../../database/modify_mysql_db');
var child_api = require('../child/child_api');

var log_api = require('../log/log_api');
var log_constant = require('../log/log_constant');
var log_info_string = require('../log/log_info_string');
var log_detail_string  = require('../log/log_detail_string');

function delete_relative_data(user_id, user_name, res) {
    var resData = {};

    var strSql2 = "DELETE FROM res_as_auth WHERE user_id=" + user_id;

    // 用户上传的主题背景图片
    var strSql3 = "DELETE FROM res_theme WHERE user_id=" + user_id;

    // 用户权限
    var strSql4 = "DELETE FROM cfg_user_access WHERE user_id=" + user_id;

    // 用户会话
    var strSql5 = "DELETE FROM res_user_session WHERE user_id=" + user_id;

    modify_db.delete(strSql2, function(err2, result2){
        util.printLog('strSql', strSql2);
        util.printLog('result', result2);

        modify_db.delete(strSql3, function(err3, result3){
            util.printLog('strSql', strSql3);
            util.printLog('result', result3);

            modify_db.delete(strSql4, function(err4, result4){
                util.printLog('strSql', strSql4);
                util.printLog('result', result4);

                modify_db.delete(strSql5, function(err5, result5){
                    util.printLog('strSql', strSql5);
                    util.printLog('result', result5);

                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '删除关联数据成功';

                    //res.send(resData);

                    // log
                    var auth = '';
                    var source = JSON.stringify(__filename);
                    var event_tm = util.getFormatCurTime();
                    var info = log_info_string.getUserDeleteInfoString(user_name);
                    var event = log_constant.getLogEventDeleteName();
                    var status = log_constant.getLogStatusSuccessName();
                    var detail = log_detail_string.getDetailString2(event_tm, 'user_modify', auth, user_name, event, '', status);
                    var remark = '';
                    var level_id = log_constant.getLogLevelInfoId();
                    var event_id = log_constant.getLogEventDeleteId();
                    log_api.writeAdminLog(level_id, event_id, source, event_tm, auth, info, detail, remark, function(logErr, logResult){

                        res.send(resData);
                    });

                });

            });

        })

    })

}

router.post('/', function(req, res, next) {
    var req_body = req.body;

    if (global.print_log) {
        console.log('user delete req body: ' + JSON.stringify(req_body));
    }

    var resData = {};

    var user_id = req_body.id;
    var user_name = req_body.name;

    if (user_id < 1) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误，ID无效';
        res.send(resData);
        return false;
    }
    else {
        var strSql = "DELETE FROM res_user WHERE id=" + user_id;

        modify_db.delete(strSql, function(err, result) {
            util.printLog('strSql', strSql);
            util.printLog('result', result);

            if (err) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败！错误信息：' + err.message;
                res.send(resData);
                return false;
            }
            else {
                // 删除关联账户
                child_api.delUser(user_name, null);
                // 删除关联数据
                delete_relative_data(user_id, user_name, res);
            }
        });
    }

});

module.exports = router;