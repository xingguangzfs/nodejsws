/**
 * Created by fushou on 2019/6/21.
 */

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var child_packet = require('./child_packet');
var child_user_data = require('./child_user_data');

// cache
var cache = require('../../common/Node-Simple-Cache-master/Manage');

// cc
var cc_op = require('../net/cc_op');
var cc_task = require('../net/cc_task');

// WebSocket Server
var webServer = require('../net/websocket_server');
var child_filter_wss = require('./child_filter_wss');
var map_array = require('../../common/map_array');


var module_name = 'child_pro_cc';

util.SetPrintLog(true);

function onSendData(data) {
    process.send(data);
}

function onInit(mon_port, print_log) {
    util.SetMonPort(mon_port);
    util.SetCache(cache);
    util.SetPrintLog(print_log ? true : false);

    // cc
    cc_op.start();
    util.SetCCOP(cc_op);

    // webserver
    webServer.start(util.GetMonPort(), child_filter_wss);
    util.SetWebServer(webServer);

    // wss 映射列表
    var map_array_list = map_array.createMapArray();
    util.SetMapList(map_array_list);
}

function onFilter(res) {
    var that = this;

    var status = 0;

    util.printLog(module_name, res);

    var cmdid = res[json_key.getCmdIdKey()];
    switch(cmdid) {
        case child_packet.getChildInitCmdId(): {
            // 初始化包
            var id = res[json_key.getIdKey()];
            var name = res[json_key.getNameKey()];
            var print_log = res['print_log'];
            var port = res[json_key.getPortKey()];

            var itemData = {
                id: id,
                name: name
            }

            child_user_data.onSetUserData(itemData);

            var resPacketData = child_packet.getChildInitRespPacket(id, 0, '成功');
            onSendData(resPacketData);

            // 初始化
            onInit(port, print_log);

            status = 1;
        }break;

        case child_packet.getChildExitCmdId() : {
            // 关闭
            var id = res[json_key.getIdKey()];
            util.printLog(module_name, '(' + id +  ') process exit.');
            process.exit(0);
            status = 1;
        }break;

        default: {
            util.printLog(module_name, 'unknown packet.');
            status = 0;
        }break;
    }

    return status;
}

// 子进程监听消息
process.on('message', function(m) {
    onFilter(m);
});
