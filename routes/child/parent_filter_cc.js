/**
 * Created by fushou on 2019/7/8.
 */
var util = require('../../common/util');
var json_key = require('../../common/json_key');
var child_packet = require('./child_packet');

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

    onCallCompleted: function(err, datas) {
        var that = this;
        if (that.completed) {
            that.completed(err, datas);
        }
    },

    onSend: function(data, callback) {
        var that = this;
        var handle = that.onGetUserData().handle;
        if (!handle) {
            return false;
        }

        that.onSetCompleted(callback);
        handle.send(data);

        return true;
    },

    onFilter: function(res) {
        var that = this;

        var status = 0;
        util.printLog('parent_filter_cc recv packet', res);

        var errno = 0;
        var errmsg = '';
        var list = null;

        var cmdid = res[json_key.getCmdIdKey()];
        switch(cmdid) {
            case child_packet.getChildInitRespCmdId(): {
                util.printLog('parent_filter_cc init resp packet', res);
                status = 1;
            }break;

            case child_packet.getChildAsLoadRespCmdId():// AS负载应答包
            case child_packet.getChildUserActiveRespCmdId(): // 用户活动信息应答包
            {
                errno = res[json_key.getErrNoKey()];
                if (errno) {
                    errmsg = res[json_key.getErrMsgKey()];
                    that.onCallCompleted(errmsg, null);
                }
                else {
                    list = res[json_key.getListKey()];
                    that.onCallCompleted(null, list);
                }
                status = 1;
            }break;

            default: {
                util.printLog('parent_filter_cc', 'unknown packet.');
                status = 0;
            }break;
        }

        return status;
    }
};

module.exports = obj;