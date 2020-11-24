/**
 * Created by fushou on 2019/8/29.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

var module_name = 'app_image_confirm';

function onFileProcess(src_file_name, dst_file_name, file_name_index, file_text, file_size, res) {
    var resData = {};

    var dst_file_width = 48;
    var dst_file_height = 48;
    var dst_target = 'app';
    var dst_enable = 1;
    var dst_position = 0;
    var dst_remark = '';

    // 文件复制
    var src_path = util.GetTempImagePath();
    var src_file = src_path + '\\' + src_file_name;

    var dst_path = util.GetAutoAppImagePath();
    var dst_file = dst_path + '\\' + dst_file_name;

    var dst_net_path = util.GetAutoAppImageNetRelatePath();
    var dst_file_name = dst_file_name;
    var dst_file_size = file_size;


    // 拷贝文件
    if (!util.CopyFileUseStream(src_file, dst_file)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '确认失败，文件保存失败';
        res.send(resData);

        return false;
    }

    // 删除源文件
    util.DeleteFile(src_file);

    var strSql = "INSERT INTO res_image_owner (rfolder,file_name,";
    strSql += "file_name_index,text,width,height,size,target,enable,";
    strSql += "position,remark) VALUES(";
    strSql += "'" + dst_net_path + "',";
    strSql += "'" + dst_file_name + "',";
    strSql += file_name_index + ",";
    strSql += "'" + file_text + "',";
    strSql += dst_file_width + ",";
    strSql += dst_file_height + ",";
    strSql += file_size + ",";
    strSql += "'" + dst_target + "',";
    strSql += dst_enable + ",";
    strSql += dst_position + ",";
    strSql += "'" + dst_remark + "'";
    strSql += ")";

    modify_db.insert(strSql, null, function(err, result){
        util.printLog(module_name + ' strSql', strSql);
        util.printLog(module_name + ' result', result);

        if (err) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '保存图片失败';
            res.send(resData);
            return false;
        }

        var insertId = result[json_key.getInsertIdKey()];

        resData[json_key.getStatusKey()] = 1;
        resData[json_key.getMsgKey()] = '保存成功';

        var resItemData = {
            id: insertId,
            name: dst_file_name,
            path: dst_net_path,
            size: file_size,
            text: file_text
        }

        resData[json_key.getDataKey()] = resItemData;

        res.send(resData);

    });
}

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;
    if (global.print_log) {
        console.log('app image confirm req body: ' + JSON.stringify(req_body));
    }

    var item_name = req_body[json_key.getNameKey()];
    var item_file = req_body[json_key.getFileKey()];
    var item_size = req_body[json_key.getSizeKey()];

    if (util.IsEmpty(item_name) || util.IsEmpty(item_file)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';
        res.send(resData);
        return false;
    }

    if (util.IsEmpty(item_size)) {
        item_size = 0;
    }

    // 分解文件名称
    var item_name_arr = item_name.split('.');
    var dst_text = item_name_arr.length > 0 ? item_name_arr[0] : item_name;

    var src_file_name = item_name;
    var dst_file_name = item_name;
    var file_name_index = 0;

    // SELECT id,file_name,text FROM res_image WHERE file_name LIKE '%P%' ORDER BY id DESC LIMIT 1
    var strSql = "SELECT file_name,file_name_index,text FROM res_image_owner WHERE file_name LIKE '%";
    strSql += dst_text;
    strSql += "%' ORDER BY file_name_index DESC LIMIT 1";

    // 查询历史同名文件名称，必要时修改目标文件名
    db.query(strSql, function(err, result, fields){
        util.printLog(module_name + ' strSql', strSql);
        util.printLog(module_name + ' result', result);

        if (!err && result.length > 0) {
            var historyItemData = result[0];

            file_name_index = historyItemData.file_name_index + 1;

            if (item_name_arr.length >= 2) {
                dst_file_name = dst_text + '_' + file_name_index + '.' + item_name_arr[1];
            }
        }

        onFileProcess(src_file_name, dst_file_name, file_name_index, dst_text, item_size, res);
    });


});

module.exports = router;