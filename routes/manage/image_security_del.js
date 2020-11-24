/**
 * Created by fushou on 2020/3/10.
 */
var express = require('express');
var router = express.Router();

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

var filter_image = ['pdf.png','exit.png','tool.png','settings.png','setting2.png','about.png'];

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;

    util.printLog('image_security_del', req_body);

    var item_id = req_body.id;

    if (util.IsEmpty(item_id) || item_id <= 0) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '请求参数错误';
        return false;
    }

    // 查询要删除的图标信息
    var strSql = "SELECT id,rfolder,file_name,text FROM res_image WHERE enable=1 AND id=" + item_id;
    db.query(strSql, function(err, result){
        util.printLog('strSql', strSql);
        util.printLog('result', result);

        if (err || result.length == 0) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '删除失败，图标不允许删除';
            res.send(resData);
            return true;
        }

        var itemData = result[0];

        var item_rfolder = itemData.rfolder;
        var item_file_name = itemData.file_name;
        var item_text = itemData.text;

        var item_image = item_rfolder + '/' + item_file_name;

        // 判断是否为过滤列表中的图标
        var is_not_security = false;
        var idx = 0;
        for(idx = 0; idx < filter_image.length; idx++) {
            var image_name = filter_image[idx];
            if (item_file_name == image_name) {
                is_not_security = true;
                break;
            }
        }

        if (is_not_security) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '删除失败，图标不允许删除';
            res.send(resData);
            return true;
        }

        // 判断是否被应用所使用
        var strSql2 = "SELECT id FROM res_app WHERE app_image='" + item_image + "'";
        db.query(strSql2, function(err2, result2){
            util.printLog('strSql', strSql2);
            util.printLog('result', result2);

            if (err2) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败，内部错误，请另选时间再删除';
                res.send(resData);
                return false;
            }

            if (result2.length > 0) {
                resData[json_key.getStatusKey()] = 0;
                resData[json_key.getMsgKey()] = '删除失败，图标不允许删除';
                res.send(resData);
                return true;
            }

            // 删除数据库记录
            var strSqlDel = "DELETE FROM res_image WHERE enable=1 AND id=" + item_id;
            modify_db.delete(strSqlDel, function(err3, result3){
                util.printLog('strSql', strSqlDel);
                util.printLog('result', result3);

                if (err3) {
                    resData[json_key.getStatusKey()] = 0;
                    resData[json_key.getMsgKey()] = '删除失败，内部错误，请另选时间再删除';
                    res.send(resData);
                    return false;
                }
                else {

                    // 删除文件
                    var image_full_path = util.GetRootPath() + '/public/' + item_image;
                    util.DeleteFile(image_full_path);

                    resData[json_key.getStatusKey()] = 1;
                    resData[json_key.getMsgKey()] = '删除成功';
                    res.send(resData);
                    return true;
                }
            });
        });
    });

});

module.exports = router;