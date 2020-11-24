/**
 * Created by fushou on 2019/6/24.
 */
var http = require('http');

var querystring = require('querystring');

var util = require('../../common/util');

var obj = {

    get: function(option, callback) {
        var req = http.request(option, function(res){
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            var resData = '';
            res.setEncoding('utf-8');
            res.on('data', function(chunk){
                resData += chunk;
            });

            res.on('end', function(){
                if (callback) {
                    callback(null, resData);
                }
            });

        });

        req.on('error', function(err){
           console.log('http request error: ' + JSON.stringify(err));

            if (callback) {
                callback(err, null);
            }
        });

        req.end();
    },

    get2: function(host, port, path, callback) {
        var that = this;

        var options = {
            hostname: host,
            port: port,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return that.get(options, callback);
    },

    post: function(option, strPostData, callback){

        var req = http.request(option, function(res){
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf-8');

            var resData = '';

            res.on('data', function(data){
                resData += data;
            });

            res.on('end', function(){
                if (callback) {
                    callback(null, resData);
                }
                return;
            });

        });

        req.on('error', function(err){
            util.printLog('http request post err', err);
            if (callback) {
                callback(err, null);
            }
        });

        // 添加请求参数
        req.write(strPostData);
        req.end();
        return;
    },

    post2: function(host, port, path, postData, callback) {
        var that = this;

        var strPostData = querystring.stringify(postData);
        var options = {
            host: host,
            port: port,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', // application/x-www-form-urlencoded; charset-UTF-8
                'Content-Length': strPostData.length
            }
        };

        that.post(options, strPostData, callback);
    }

}

module.exports = obj;
