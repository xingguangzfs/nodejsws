/**
 * Created by fushou on 2019/4/29.
 */
var net = require('net');

function getNewSocket() {
    var socket = new net.Socket();
    socket.setEncoding('binary'); // TCP必须使用二进制编码，否则原始数据有被修改的危险
    socket.setKeepAlive(true, 0); // 启用长连接
    return socket;
}

var socket = getNewSocket();

var tcp_client = {

    connect: function(port, ipv4, callback) {
        if (socket == null) {
            socket = getNewSocket();
        }
        socket.connect(port, ipv4, callback);
    },

    onrecv: function(callback) {
        socket.on('data', callback);
    },

    onsend: function(data, encoding, callback) {
        socket.write(data, encoding, callback);
    },

    ondestroy: function() {
        socket.destroy();
    },

    // 不能随便销毁，如果销毁了，就得重新new一个新的socket
    onclose: function(callback) {
        socket.on('close', callback);
    },

    onerror: function(callback) {
        socket.on('error', callback);
    }
}

module.exports = tcp_client;
