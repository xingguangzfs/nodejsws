/**
 * Created by fushou on 2019/6/19.
 */

var child_process = require('child_process');
var util = require('../../common/util');
var json_key = require('../../common/json_key');
var child_packet = require('./child_packet');
var async = require('async');

const module_name = 'parent recv message';

var obj = {
    datas: [
        {
            // 与CC通信模块
            id: 1,
            name: 'cc',
            path: '..\\routes\\child\\child_proc_cc.js',
            handle: null,
            filter: require('./parent_filter_cc'),
            execArgv: process.execArgv,
            silent: false,
            exit: 0
        },
       {
            // 用户定时任务模块
            id: 2,
            name: 'sch',
            path: '..\\routes\\child\\child_proc_sch.js',
            handle: null,
            filter: require('./parent_filter_cc'),
            execArgv: process.execArgv,
            silent: false,
            exit: 0
        }
    ],

    // 启动子服务进程
    start: function() {
        var that = this;

        if (that.datas.length < 1) {
            util.printLog('child service', 'start arg invalid.');
            return 0;
        }

        // 创建子服务进程
        var idx = 0;
        var count = 0;
        for(idx = 0; idx < that.datas.length; idx++) {
            if (1 == that.onForkChildService(idx)) {
                count++;
            }
        }

        util.printLog('child service start count', count);

        // 返回启动成功个数
        return count;
    },

    stop: function() {
        var that = this;

        if (that.datas.length < 1) {
            util.printLog('child service', 'start arg invalid.');
            return 0;
        }

        // 创建子服务进程
        var idx = 0;
        var count = 0;
        for(idx = 0; idx < that.datas.length; idx++) {
            var itemData = that.datas[idx];
            if (itemData.handle) {
                // 发送初始化包
                itemData.exit = 1;
                var exitPkt = child_packet.getChildExitPacket(itemData.id);
                itemData.handle.send(exitPkt);
                count++;
            }
        }

        util.printLog('child service stop count', count);

        // 返回启动成功个数
        return count;
    },

    // 创建子服务进程
    onForkChildService: function(service_index) {
        var that = this;
        var index = service_index;
        var itemData = that.datas[index];
        if (itemData.handle) {
            return 1;
        }
        var handle = child_process.fork(itemData.path, {
            execArgv: itemData.execArgv,
            silent: itemData.silent
        });

        if (handle) {
            itemData.handle = handle;
            // 监听message事件，获取子进程返回数据
            handle.on('message', function(res){
                itemData.filter.onFilter(res);
            });

            handle.on('exit', function(code){
                // 子进程退出，延迟30秒后再重新启动
                that.datas[index].handle = null;

                util.printLog('child service', 'index:' + index + ' name:' + itemData.name + ' process exit...');
                util.printLog('exit code', code);

                if (that.datas[index].exit == 0) {
                    util.printLog('child service', 'process will later 10 seconds restart.');
                    setTimeout(function () {
                        that.onForkChildService(index);
                    }, 10 * 1000);
                }
            });

            that.datas[index] = itemData;

            itemData.filter.onSetUserData(itemData);

            // 发送初始化包
            var initPkt = child_packet.getChildInitPacket(itemData.id, itemData.name, util.GetMonPort());
            handle.send(initPkt);

            return 1;
        }
        else {
            // 启动失败，延迟30秒后重新启动
            util.printLog('child service', 'index:' + index + ' name:' + itemData.name + ' process start fail...');
            util.printLog('child service', 'process will later 10 seconds restart.');

            setTimeout(function(){
                that.onForkChildService(index);
            }, 10 * 1000);

            return 0;
        }
    },

    onGetOwnerData: function(name) {
        var that = this;
      for(var idx = 0; idx < that.datas.length; idx++) {
          var itemData = that.datas[idx];
          if (name == itemData.name) {
              return itemData;
          }
      }
        return null;
    },

    onGetCCOwnerData: function() {
        var that = this;
        return that.onGetOwnerData('cc');
    },

    onSendToCC: function(data) {
        var that = this;
        var itemData = that.onGetCCOwnerData();
        if (!itemData || !itemData.handle || !itemData.filter) {
            return false;
        }
        itemData.handle.send(data);

        return true;
    }

};

module.exports = obj;