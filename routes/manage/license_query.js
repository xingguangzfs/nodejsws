/**
 * Created by fushou on 2019/4/25.
 */
var express = require('express');
var router = express.Router();

var json_key = require('../../common/json_key');
var util = require('../../common/util');

router.get('/', function(req, res, next){
    var resData = {};

    resData[json_key.getStatusKey()] = 1;
    resData[json_key.getMsgKey()] = '成功';

    var count = util.getLicenseCount(); // 授权用户数
    var day = util.getLicenseDay(); // 授权使用天数
    var date = util.getLicenseDate(); // 授权开始日期，数字值
    var strDate = date.toString();
    var begin = util.dateToString(strDate); // 开始日期
    var end = util.formatDate(strDate, day); // 结束日期
    var diff = util.diffDay(end); // 计算剩余天数

    resData[json_key.getCountKey()] = count;
    resData[json_key.getDayKey()] = day;
    resData[json_key.getDateKey()] = date;
    resData[json_key.getBeginKey()] = begin;
    resData[json_key.getEndKey()] = end;
    resData[json_key.getDiffKey()] = diff;

    res.send(resData);
});

module.exports = router;
