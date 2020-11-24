/**
 * Created by fushou on 2019/6/21.
 */

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var child_packet = require('./child_packet');
var cc_task = require('../net/cc_task');

var module_name = 'child_filter_cc';

var obj = {

    user_data: null,

    completed: null,

    onSetUserData: function(data) {
        this.user_data = data;
    },

    onGetUserData: function() {
        return this.user_data;
    },

    onSetCompleted: function(callback) {
        this.completed = callback;
    },

    onGetCompleted: function() {
        return this.completed;
    },

    onGetModuleId: function () {
        var that = this;
        var owner_data = that.onGetUserData();
        if (owner_data == null || owner_data == undefined) {
            return 0;
        }
        return owner_data[json_key.getIdKey()];
    },

    onGetModuleName: function () {
        var that = this;
        var owner_data = that.onGetUserData();
        if (owner_data == null || owner_data == undefined) {
            return '';
        }
        return owner_data[json_key.getNameKey()];
    },

    onSend: function(data) {
        process.send(data);
    },

    onFilter: function (res) {
        var that = this;

        var status = 0;

        //util.printLog(module, typeof(res)); // object
        util.printLog(module_name, res);

        var cmdid = res[json_key.getCmdIdKey()];
        switch(cmdid) {
            case child_packet.getChildInitCmdId(): {
                // 初始化包
                var id = res[json_key.getIdKey()];
                var name = res[json_key.getNameKey()];
                var print_log = res['print_log'];

                var itemData = {
                    id: id,
                    name: name
                }

                that.onSetUserData(itemData);

                util.SetPrintLog(print_log);

                var resPacketData = child_packet.getChildInitRespPacket(id, 0, '成功');

                that.onSend(resPacketData);

                status = 1;
            }break;

            case child_packet.getChildExitCmdId() : {
                // 关闭
                util.printLog(module_name, ' process exit.');
                process.exit(0);
            }break;

            default: {
                util.printLog(module_name, 'unknown packet.');
                status = 0;
            }break;
        }

        return status;
    }

};

module.exports = obj;
