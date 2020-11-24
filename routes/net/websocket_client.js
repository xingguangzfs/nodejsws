/**
 * Created by fushou on 2019/7/10.
 */
var webSocket = require('ws');

var obj = {

    ws: null,
    user_data: null,

    setdata: function(data) {
        this.user_data = data;
    },

    getdata: function() {
        return this.user_data;
    },

    connect: function(port, host, callback) {
        var that = this;

        // 'ws://localhost:3391'
        var url = 'ws://' + host + ':' + port;
        that.ws = new webSocket(url);

        that.ws.on('open', callback);
    },

    disconnect: function() {
        var that = this;

        if (that.ws) {
            //that.ws.terminate(); // 强制关闭连接
            that.ws.close(); // 发出断开连接请求
        }
    },

    onsend:function(data, callback) {
        var that = this;

        var options = {
            compress: true, // 压缩标志
            binary: false, // 采用二进制传输标志
            fin: true // 当前data是否是message的最后一个fragment，默认为true
        };

        var strData = (typeof (data) == 'string') ? data : JSON.stringify(data);

        if (callback) {
            return that.ws.send(strData, options, callback);
        }
        else {
            return that.ws.send(strData);
        }
    },

    onrecv: function(callback) {
        var that = this;
        that.ws.on('message', callback);
    },

    onclose: function(callback) {
        var that = this;

        that.ws.on('close', callback);
    },

    onerror: function(callback) {
        var that = this;

        that.ws.on('error', callback);
    }
};

module.exports = obj;
