/**
 * Created by fushou on 2017/7/16.
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

var config = {
    host : host,
    user : user,
    password : password,
    database : dbname,
    port : port,
     maxs : maxs,
     mins : mins,
     supportBigNumbers: true,
     idleTimeoutMills : idle_timeout_millis,
     reapIntervalMills : reap_interval_millis,
     priorityRange : priority_range,
     log : vlog
};

var mysql = require("mysql");
var pool = mysql.createPool(config);

exports.insert = function(sql, param_values, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null);
        }
        else {
            conn.query(sql, param_values, function(qerr, results){
                callback(qerr, results);
            });
            conn.release();
        }
    });
};

exports.modify = function(sql, param_values, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null);
        }
        else {
            conn.query(sql, param_values, function(qerr, results){
                callback(qerr, results);
            });
            conn.release();
        }
    });
};

exports.delete = function(sql, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            callback(err, null);
        }
        else {
            conn.query(sql, function(qerr, results){
                callback(qerr, results);
            });
            conn.release();
        }
    });
};

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
