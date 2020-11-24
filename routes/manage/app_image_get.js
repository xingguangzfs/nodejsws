/**
 * Created by fushou on 2019/8/28.
 */

var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');
var child_api = require('../child/child_api');

router.post('/', function(req, res, next){
    var resData = {};

    var req_body = req.body;
    if (global.print_log) {
        console.log('app image get req body: ' + JSON.stringify(req_body));
    }

    var ip = req_body.ip;
    var app_full_file = req_body.app_full_file;

    if (util.IsEmpty(ip) || util.IsEmpty(app_full_file)) {
        resData[json_key.getStatusKey()] = 0;
        resData[json_key.getMsgKey()] = '参数错误';

        res.send(resData);
        return false;
    }

    // UTF8编码后字符串化
    app_full_file = util.getEncoding(app_full_file, 'utf8');
    app_full_file = JSON.stringify(app_full_file);

    child_api.getAppImage(ip, app_full_file, function(err, datas) {
        if (err) {
            util.printLog('app_image_get getAppImage err', err);

            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取图标发生错误';
        }
        else if (datas.length < 1) {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '没有获取到图标';
        }
        else {
            // app_image_get getAppImage data: [{"status":1,"name":"mspaint.png","size":4369}]
            util.printLog('app_image_get getAppImage data', datas);

            var itemData = datas[0];

            resData[json_key.getStatusKey()] = itemData.status;

            if (itemData.status == 1) {
                resData[json_key.getMsgKey()] = '成功';

                var net_temp_path = util.GetTempImageNetRelatePath();
                var image_file = net_temp_path + '/' + itemData.name;

                var resDataItem = {
                    name: itemData.name,
                    size: itemData.size,
                    file: image_file
                }

                resData[json_key.getDataKey()] = resDataItem;
            }
            else {
                resData[json_key.getMsgKey()] = '没有获取到图标';
            }

        }

        res.send(resData);

    });


});

module.exports = router;
