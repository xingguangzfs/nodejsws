/**
 * Created by fushou on 2018/6/19.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var db = require('../../database/mysql_db');

router.post('/', function(req, res, next) {

    var req_body = req.body;

    if (global.print_log) {
        console.log('image list req body: ' + JSON.stringify(req_body));
    }

    var all = req_body.all;

    var resData = {};
    var statusKey = json_key.getStatusKey();
    var msgKey = json_key.getMsgKey();

    var strSql = 'SELECT id,rfolder,file_name,text,width,height,size,target,enable,position,remark FROM res_image';
    if (all != 1) {
        strSql +=  ' WHERE enable=1';
    }
    strSql += ' ORDER BY position ASC, id ASC';

    db.query(strSql, function(err, result, fields){
        if (global.print_log) {
            console.log('strSql: ' +  strSql);
            console.log('result: ' + JSON.stringify(result));
        }
        if (err) {
            resData[statusKey] = 0;
            resData[msgKey] = '失败!' + err;
            console.log(err);
        }
        else {
            var data_list = [];
            for(var idx = 0; idx < result.length; idx++) {
                var item_pt = result[idx];
                var itemData = {};
                itemData[json_key.getIdKey()] = item_pt.id;
                itemData[json_key.getRFolderKey()] = item_pt.rfolder;
                itemData[json_key.getFileNameKey()] = item_pt.file_name;
                itemData[json_key.getTextKey()] = item_pt.text;
                itemData[json_key.getWidthKey()] = item_pt.width;
                itemData[json_key.getHeightKey()] = item_pt.height;
                itemData[json_key.getSizeKey()] = item_pt.size;
                itemData[json_key.getTargetKey()] = item_pt.target;
                itemData[json_key.getEnableKey()] = item_pt.enable;
                itemData[json_key.getPositionKey()] = item_pt.position;
                itemData[json_key.getRemarkKey()] = item_pt.remark;

                data_list[idx] = itemData;
            }

            resData[statusKey] = 1;
            resData[msgKey] = '成功';
            resData[json_key.getTotalCountKey()] = data_list.length;
            resData[json_key.getListKey()] = data_list;
        }
        res.send(resData);
    })
})

module.exports = router;