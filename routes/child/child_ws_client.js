/**
 * Created by fushou on 2019/7/10.
 */

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var webClient = require('../net/websocket_client');

var child_packet = require('./child_packet');

var module_name = 'child_ws_client';

function onSend(data, callback) {
    var that = this;
    util.printLog(module_name + ' send data', JSON.stringify(data));
    webClient.setdata(callback);
    webClient.onsend(data, null);
    return true;
}

function onRecv(res) {
    return onParseRecvData(res);
}

function onError(err) {
    util.printLog(module_name + ' error', err);
    webClient.disconnect();
}

function onClose() {
    var that = this;
    util.printLog(module_name, 'close.');
    util.printLog(module_name, ' will later 10 seconds reconnect...');

    var timer = setTimeout(function(){
        onConnect(util.GetMonHost(), util.GetMonPort());

    }, 10000);
}

function onConnect(host, port) {
    var that = this;

    webClient.connect(port, host, function () {
        util.printLog(module_name, 'connect to ' + host + ':' + port + ' success.');

        // 注册回调函数
        webClient.onrecv(onRecv);
        webClient.onerror(onError);
        webClient.onclose(onClose);

        // 发送初始化消息
        var initPacket = child_packet.getChildInitPacket(1, 'websocket_ws_client');

        webClient.setdata(null);
        webClient.onsend(JSON.stringify(initPacket), function () {

        });
    });
}

function onParseRecvData(res) {
    util.printLog(module_name + ' recv data', res);

    var status = 0;

    var strObj = null;

    try {
        var datas = [];
        if (typeof(res) == 'string') {
            strObj = JSON.parse(res);
        }
        else if (typeof(res) == 'object') {
            strObj = res;
        }
        else {
            util.printLog(module_name, 'unknow data type.');
            return 0;
        }

        var cmdid = strObj[json_key.getCmdIdKey()];
        switch(cmdid) {
            case child_packet.getChildWelcomeCmdId(): {
                // 欢迎消息
                var msg = strObj[json_key.getMsgKey()];
                util.printLog(module_name, msg);
                status = 1;
            }break;

            case child_packet.getChildInitRespCmdId(): {
                status = 1;
            }break;

            case child_packet.getChildAsLoadRespCmdId():
            case child_packet.getChildUserActiveRespCmdId():

            case child_packet.getChildAddUserRespCmdId():
            case child_packet.getChildDelUserRespCmdId():
            case child_packet.getChildChangeUserRespCmdId():

            case child_packet.getChildAddHostRespCmdId():
            case child_packet.getChildDelHostRespCmdId():
            case child_packet.getChildChangeHostRespCmdId():
            case child_packet.getChildDiscoverHostRespCmdId():

            case child_packet.getChildChangeCfgGlobalPswdRespCmdId():
            case child_packet.getChildChangeCfgGlobalCCPortRespCmdId():

            case child_packet.getChildChangeCfgAsAccountAdminRespCmdId():
            case child_packet.getChildChangeCfgAsDesktopDenyRespCmdId():
            case child_packet.getChildChangeCfgAsRdpPortRespCmdId():
            case child_packet.getChildChangeCfgAsPollPeriodRespCmdId():

            case child_packet.getChildMonAppInstRespCmdId():
            case child_packet.getChildMonUserActInstRespCmdId():

            case child_packet.getChildMonChangeAppFilterRespCmdId():

            case child_packet.getChildAppImageRespCmdId():
            {
                datas = strObj[json_key.getListKey()];
            }break;

            default: {
                util.printLog(module_name, 'unknown cmdid.');
            }break;

        }

        if (webClient.getdata()) {
            webClient.getdata()(null, datas);
        }

    }
    catch(err) {
        util.printLog(module_name + ' error', err.message);
        if (webClient.getdata()) {
            webClient.getdata()(err, null);
        }

        return 0;
    }

    return status;
}


var obj = {

    // 连接到服务器
    connect: function(host, port) {
        var that = this;

        util.SetMonHost(host);
        util.SetMonPort(port);

        // 连接到websocket服务
        onConnect(host, port);

    },

    // 断开与服务器的连接
    disconnect: function() {
        webClient.disconnect();
    },

    // 发送数据
    onsend: function(data, callback) {
        onSend(data, callback);
    }

}

module.exports = obj;
