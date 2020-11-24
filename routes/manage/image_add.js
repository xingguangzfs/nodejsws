/**
 * Created by fushou on 2018/6/20.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
//var db = require('../../database/mysql_db');
var modify_db = require('../../database/modify_mysql_db');

router.post('/', function(req, res, next){
    var rslt = '';
    var req_body = req.body;

    // {"item_text":"word","image_target":"app","image_file":"word.png","remark":""}
    var item_text = req_body['item_text'];
    var image_target = req_body['image_target'];
    var image_file = req_body['image_file'];
    var remark = req_body['remark'];

    // 检查上传的资源文件是否存在
    var temp_image_path = util.GetTempImagePath();
    var image_path = '';
    if (image_target == 'app') {
        image_path = util.GetAppImagePath();
    }
    // 获取之前上传的临时资源文件
    var src_image_name = temp_image_path + '\\' + image_file;
    // 获取源文件大小
    var file_size = util.GetFileSize(src_image_name);

    if (global.print_log) {
        console.log('image_add parse src file: ' + src_image_name + '(' + file_size + ')');
    }

    if (file_size <= 0) {
        rslt[json_key.getStatusKey()] = 0;
        rslt[json_key.getMsgKey()] = '错误：获取资源文件信息失败，请重新上传资源文件！';
        res.send(rslt);
        return;
    }

    // 生成目标文件
    var time_name = util.GetNowTimeFileName();
    var dst_file_name = time_name + '_' + image_file;
    var dst_image_name = image_path + '\\' + dst_file_name;
    if (global.print_log) {
        console.log('image_add move \"' + src_image_name + '\" to \"' + dst_image_name + '\"');
    }
    var status = util.CopyFileUseStream(src_image_name, dst_image_name);
    if (!status) {
        rslt[json_key.getStatusKey()] = 0;
        rslt[json_key.getMsgKey()] = '错误：资源文件转存失败，请重新上传资源文件！';
        res.send(rslt);
        return;
    }

    // 保存数据库
    var image_rfolder = util.GetTargetAppImageRFolder();

    var sql = 'INSERT INTO res_image(rfolder,file_name,text,width,';
    sql += 'height,size,target,enable,remark)';
    sql += ' VALUES(';
    sql += '\'' + image_rfolder + '\',';
    sql += '\'' + dst_file_name + '\',';
    sql += '\'' + item_text + '\',';
    sql += '0,';
    sql += '0,';
    sql += file_size +',';
    sql += '\'' + image_target + '\',';
    sql += '1,';
    sql += '\'' + remark + '\')';

    if (global.print_log) {
        console.log(sql);
    }

    modify_db.insert(sql, null, function(err, result){
        if (err) {
            rslt[json_key.getStatusKey()] = 0;
            rslt[json_key.getMsgKey()] = '错误：添加数据库记录失败，请重新提交申请！';
            res.send(rslt);
            return;
        }
    });

    // 删除临时文件（异步操作，文件复制完成时间无法确定，因此不能删除）
    //util.DeleteFile(src_image_name);

    // 成功
    rslt[json_key.getStatusKey()] = 1;
    rslt[json_key.getMsgKey()] = '成功：资源新增成功！';
    res.send(rslt);

})

module.exports = router;
