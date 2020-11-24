/**
 * Created by fushou on 2016/10/15.
 */

// 连接池类
var dom = require('xmldom').DOMParser;
var sel = require('xpath.js');
var fr = require('fs');

    var data = fr.readFileSync("../bin/config.xml", "utf-8");
    var xmldoc = new dom().parseFromString(data);

    var item = sel(xmldoc, "/root/database/host/text()");
    var host = item.toString();

    item = sel(xmldoc, "/root/database/port/text()");
    var port = item.toString();

    item = sel(xmldoc, "/root/database/dbname/text()");
    var dbname = item.toString();

    item = sel(xmldoc, "/root/database/user/text()");
    var user = item.toString();

    item = sel(xmldoc, "/root/database/password/text()");
    var password = item.toString();

    item = sel(xmldoc, "/root/database/maxs/text()");
    var maxs = item.toString();

    item = sel(xmldoc, "/root/database/mins/text()");
    var mins = item.toString();

    item = sel(xmldoc, "/root/database/idle_timeout_millis/text()");
    var idle_timeout_millis = item.toString();

    item = sel(xmldoc, "/root/database/reap_interval_millis/text()");
    var reap_interval_millis = item.toString();

    item = sel(xmldoc, "/root/database/priority_range/text()");
    var priority_range = item.toString();

    item = sel(xmldoc, "/root/database/log/text()");
    var vlog = item.toString();

var mysql = require("mysql");
var pool = mysql.createPool({
    host : host,
    user : user,
    password : password,
    database : dbname,
    port : port,
    maxs : maxs, // 最大并发数
    mins : mins, // 最小并发数
    supportBigNumbers: true,
    idleTimeoutMills : idle_timeout_millis,
    reapIntervalMills : reap_interval_millis, // 检测空闲资源的频率，单位：毫秒
    priorityRange : priority_range,
    log : vlog
});

exports.query = function(sql, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            callback(err, null, null);
        }
        else {
            conn.query(sql, function(qerr, results, fields){
                callback(qerr, results, fields);
            });
            conn.release();
        }
    });
};

exports.query2 = function(sql, param_values, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
        }
        else {
            conn.query(sql, param_values, function(qerr, results, fields){
                callback(qerr, results, fields);
            });
            conn.release();
        }
    });
};


