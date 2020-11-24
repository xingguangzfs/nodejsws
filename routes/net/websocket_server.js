/**
 * Created by fushou on 2019/7/10.
 */
// 创建 WebSocket Server

var webServer = require('ws').Server;
var util = require('../../common/util');

var module_name = 'websocket_server';

var obj = {

    wss: null,
    filter_: null,

    start: function(port, filter) {
        var that = this;

        if (that.wss) {
            return true;
        }
        that.filter_ = filter;

        // webSocket
        var wss = new webServer({port: port});
        that.wss = wss;

        util.printLog(module_name, 'begin running ' + port + ' ...');

        wss.on('connection', function (ws, req) {
            // 有新客户连接
            util.printLog(module_name, 'new client connect.');

            if (that.filter_) {
                that.filter_.onClientConnect(ws, req);
            }

            ws.on('message', function (message) {
                if (that.filter_) {
                    that.filter_.onFilter(message, ws);
                }
                else {
                    util.printLog(module_name + ' client recv', message);
                }
            });

            ws.on('error', function (error) {
                if (that.filter_) {
                    that.filter_.onError(error, ws);
                }
                else {
                    util.printLog(module_name + ' client error', error);
                }
                ws.close();
            });

            ws.on('close', function () {
                if (that.filter_) {
                    that.filter_.onClientClose(ws);
                }
                else {
                    util.printLog(module_name, 'client close.');
                }
            });

            // 发送心跳包
            // 通过ping, pong事件检测连接是否仍可用
            ws.isAlive = true;
            ws.on('pong', that.heartbeat);

        });

        wss.on('error', function (err) {
            var that = this;
            if (that.filter_) {
                that.filter_.onServiceError(err);
            }
            else {
                util.printLog(module_name + ' service error', err.message);
            }
        });

        wss.on('close', function () {
            var that = this;

            if (that.filter_) {
                that.filter_.onServiceClose();
            }
            else {
                util.printLog(module_name, 'service close.');
            }
        });

        const interval = setInterval(function pint() {
            that.wss.clients.forEach(function each(ws) {
                if (ws.isAlive == false) {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping(that.noop);
            });
        }, 30000);
    },

    stop: function() {
        var that = this;

        if (that.wss) {
            that.wss.close();
            that.wss = null;
        }
    },

    heartbeat: function() {
        this.isAlive = true;
    },

    noop: function() {

    },

    ping: function() {
        var that = this;

        that.wss.clients.forEach(function each(ws){
            if (ws.isAlive == false) {
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping(that.noop);
        });
    }

}

module.exports = obj;
