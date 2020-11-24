/**
 * Created by fushou on 2019/7/10.
 */

var wrapper = require('../../common/wrapper');
var util = require('../../common/util');
var json_key = require('../../common/json_key');
var child_packet = require('./child_packet');
var cc_task = require('../net/cc_task');

var map_array = require('../../common/map_array');

const module_name = 'child_filter_wss';

var obj = {
    map_list: null,

    getMapList: function() {
        return util.GetMapList();
    },

    getMapListKey: function(cmdid) {
        var key = '';

        switch(cmdid) {
            case child_packet.getChildMonUserCmdId(): {
                key = util.GetMapListKey('mon_user');
            }break;

            case child_packet.getChildMonHostCmdId(): {
                key = util.GetMapListKey('mon_host');
            }break;

            case child_packet.getChildMonAppCmdId(): {
                key = util.GetMapListKey('mon_app');
            }break;

        }

        return key;
    },

    onClientConnect: function(owner, user_data) {
        util.printLog(module_name, 'remote client connect.');

        // 发送欢迎消息
        var resPacketData = child_packet.getChildWelcomePacket('Welcome connect to wss server!');
        owner.send(JSON.stringify(resPacketData));
    },

    onClientClose: function(owner) {
        var that = this;

        util.printLog(module_name, 'remote client close.');

        if (that.getMapList()) {
            that.getMapList().removeData(owner);
        }
    },

    onError: function(error, owner) {
        // 会话出错
        util.printLog(module_name + ' error', error.message);
    },

    onServiceError: function(error) {
        var that = this;

        // Websocket服务出错
        util.printLog(module_name + ' service error', error.message);

        if (that.getMapList()) {
            that.getMapList().clear();
        }
    },

    onServiceClose: function() {
        var that = this;

      //  Websocket 关闭
        util.printLog(module_name + ' service', 'close.');

        if (that.getMapList()) {
            that.getMapList().clear();
        }
    },

    onFilter: function(res, owner) {
        var that = this;

        var status = 0;
        util.printLog(module_name + ' recv data', res);

        var strObj = null;
        try {
            if (typeof (res) == 'string') {
                strObj = JSON.parse(res);
            }
            else if (typeof (res) == 'object') {
                strObj = res;
            }
            else {
                util.printLog(module_name, 'unknow data type');
                return 0;
            }

            var cmdid = strObj[json_key.getCmdIdKey()];
            var id = strObj[json_key.getIdKey()];

            switch(cmdid) {
                // 初始化包
                case child_packet.getChildInitCmdId(): {
                    var initRespPacket = child_packet.getChildInitRespPacket(id, 0, '');
                    that.onSend(initRespPacket, owner);
                    status = 1;
                }break;

                // 获取主机负载
                case child_packet.getChildAsLoadCmdId(): {
                    status = that.onParseAsLoad(strObj, owner);
                }break;

                // 获取用户活动信息
                case child_packet.getChildUserActiveCmdId(): {
                    status = that.onParseUserActive(strObj, owner);
                }break;

                // 添加用户
                case child_packet.getChildAddUserCmdId(): {
                    status = that.onParseAddUser(strObj, owner);
                }break;

                // 删除用户
                case child_packet.getChildDelUserCmdId(): {
                    status = that.onParseDelUser(strObj, owner);
                }break;

                // 修改用户
                case child_packet.getChildChangeUserCmdId(): {
                    status = that.onParseChangeUser(strObj, owner);
                }break;

                // 添加主机
                case child_packet.getChildAddHostCmdId(): {
                    status = that.onParseAddHost(strObj, owner);
                }break;

                // 删除主机
                case child_packet.getChildDelHostCmdId(): {
                    status = that.onParseDelHost(strObj, owner);
                }break;

                // 修改主机
                case child_packet.getChildChangeHostCmdId(): {
                    status = that.onParseChangeHost(strObj, owner);
                }break;

                // 自动发现主机
                case child_packet.getChildDiscoverHostCmdId():{
                    status = that.onParseDiscoverHost(strObj, owner);
                }break;

                // 监控用户
                case child_packet.getChildMonUserCmdId(): {
                    status = that.onParseMonUser(strObj, owner);
                }break;

                // 监控主机
                case child_packet.getChildMonHostCmdId(): {
                    status = that.onParseMonHost(strObj, owner);
                }break;

                // 监控应用
                case child_packet.getChildMonAppCmdId(): {
                    status = that.onParseMonApp(strObj, owner);
                }break;

                // 监控应用实例
                case child_packet.getChildMonAppInstCmdId(): {
                    status = that.onParseMonAppInst(strObj, owner);
                }break;

                // 监控用户活动实例
                case child_packet.getChildMonUserActInstCmdId(): {
                    status = that.onParseMonUserActInst(strObj, owner);
                }break;

                // 监控修改应用过滤
                case child_packet.getChildMonChangeAppFilterCmdId(): {
                    status = that.onParseMonChangeAppFilter(strObj, owner);
                }break;

                // 修改全局配置主机密码
                case child_packet.getChildChangeCfgGlobalPswdCmdId(): {
                    status = that.onParseChangeCfgGlobalPswd(strObj, owner);
                }break;

                // 修改全局CC通讯端口
                case child_packet.getChildChangeCfgGlobalCCPortCmdId(): {
                    status = that.onParseChangeCfgGlobalCCPort(strObj, owner);
                }break;

                // 修改AS主机管理员状态标志
                case child_packet.getChildChangeCfgAsAccountAdminCmdId(): {
                    status = that.onParseChangeCfgAsAccountAdmin(strObj, owner);
                }break;

                // 修改AS主机禁止桌面模式
                case child_packet.getChildChangeCfgAsDesktopDenyCmdId(): {
                    status = that.onParseChangeCfgAsDesktopDeny(strObj, owner);
                }break;

                // 修改AS主机RDP端口
                case child_packet.getChildChangeCfgAsRdpPortCmdId(): {
                    status = that.onParseChangeCfgAsRdpPort(strObj, owner);
                }break;

                // 修改AS主机采集频率
                case child_packet.getChildChangeCfgAsPollPeriodCmdId(): {
                    status = that.onParseChangeCfgAsPollPeriod(strObj, owner);
                }break;

                // 获取应用图标
                case child_packet.getChildAppImageCmdId(): {
                    status = that.onParseAppImage(strObj, owner);
                }break;

                default: {
                    util.printLog(module_name, 'unknown cmdid.');
                }break;
            }

        }
        catch(err) {
            util.printLog(module_name + ' parse error', err.message);
            return 0;
        }

        return status;
    },

    onSend: function(data, owner) {
        var strData = '';
        if (typeof (data) != 'string') {
            strData = JSON.stringify(data);
        }
        else {
            strData = data;
        }
        return owner.send(strData);
    },

    onParseAsLoad: function(reqPacket, owner) {

        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildAsLoadCmdId()) {
            return 0;
        }

        var ip_addrs = null;
        var list = reqPacket[json_key.getListKey()];
        if (list && list.length > 0) {
            ip_addrs = list;
        }

        wrapper.promiseWrapper(cc_task.getAsLoad, 2000, ip_addrs, function(err, result) {
        //cc_task.getAsLoad(ip_addrs, function(err, result){
            util.printLog(module_name + ' getAsLoad result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildAsLoadRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });

        return 1;
    },

    onParseUserActive: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildUserActiveCmdId()) {
            return 0;
        }

        var unames = null;
        var list = reqPacket[json_key.getListKey()];
        if (list && list.length > 0) {
            unames = list;
        }

        wrapper.promiseWrapper(cc_task.getUserActive, 2000, unames, function(err, result) {
        //cc_task.getUserActive(unames, function(err, result){
            util.printLog(module_name + ' getUserActive result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildUserActiveRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });

        return 1;
    },

    // 添加用户
    onParseAddUser: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildAddUserCmdId()) {
            return 0;
        }

        var status = reqPacket[json_key.getStatusKey()];
        var user_name = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.addUser, 2000, user_name, status, function(err, result){
            util.printLog(module_name + ' addUser result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildAddUserRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    // 删除用户
    onParseDelUser: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildDelUserCmdId()) {
            return 0;
        }

        var user_name = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.delUser, 2000, user_name, function(err, result){
            util.printLog(module_name + ' delUser result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildDelUserRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeUser: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeUserCmdId()) {
            return 0;
        }

        var status = reqPacket[json_key.getStatusKey()];
        var user_name = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.changeUser, 2000, user_name, status, function(err, result){
            util.printLog(module_name + ' changeUser result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeUserRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseAddHost: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildAddHostCmdId()) {
            return 0;
        }

        var status = reqPacket[json_key.getStatusKey()];
        var ip_addr = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.addAsHost, 2000, ip_addr, status, function(err, result){
            util.printLog(module_name + ' addAsHost result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildAddHostRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseDelHost: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildDelHostCmdId()) {
            return 0;
        }

        var ip_addr = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.delAsHost, 2000, ip_addr, function(err, result){
            util.printLog(module_name + ' delAsHost result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildDelHostRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeHost: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeHostCmdId()) {
            return 0;
        }

        var status = reqPacket[json_key.getStatusKey()];
        var reqData = reqPacket[json_key.getDataKey()];
        var old_ip_addr = reqData.old_ip_addr;
        var old_status = reqData.old_status;
        var new_ip_addr = reqData.new_ip_addr;
        var new_status = reqData.new_status;

        wrapper.promiseWrapper(cc_task.changeAsHost, 2000, old_ip_addr, old_status, new_ip_addr, new_status, function(err, result){
            util.printLog(module_name + ' changeAsHost result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeHostRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseDiscoverHost: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildDiscoverHostCmdId()) {
            return 0;
        }

        wrapper.promiseWrapper(cc_task.discoverAsHost, 2000, function(err, result){
            util.printLog(module_name + ' discoveryAsHost result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildDiscoverHostRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseMonUser: function(reqPacket, owner) {
        var that = this;
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildMonUserCmdId()) {
            return 0;
        }

        wrapper.promiseWrapper(cc_task.getMonUser, 2000, function(err, result){
            util.printLog(module_name + ' getMonUser result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }

            // 返回空数据，数据后续会通过websocket陆续返回
            resPacketData = child_packet.getChildMonUserRespPacket(module_id, errno, errmsg, result);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseMonHost: function(reqPacket, owner) {
        var that = this;
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildMonHostCmdId()) {
            return 0;
        }

        var key = that.getMapListKey(cmdid);
        if (that.getMapList()) {
            that.getMapList().setValue(key, owner);
        }

        wrapper.promiseWrapper(cc_task.getMonHost, 2000, function(err, result){
            util.printLog(module_name + ' getMonHost result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }

            // 返回空数据，数据后续会通过websocket陆续返回
            resPacketData = child_packet.getChildMonHostRespPacket(module_id, errno, errmsg, null);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseMonApp: function(reqPacket, owner) {
        var that = this;
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildMonAppCmdId()) {
            return 0;
        }

        wrapper.promiseWrapper(cc_task.getMonApp, 2000, function(err, result){
            util.printLog(module_name + ' getMonApp result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }

            // 返回空数据，数据后续会通过websocket陆续返回
            resPacketData = child_packet.getChildMonAppRespPacket(module_id, errno, errmsg, result);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseMonAppInst: function(reqPacket, owner) {
        var that = this;
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildMonAppInstCmdId()) {
            return 0;
        }

        var reqData = reqPacket[json_key.getDataKey()];

        var name = reqData[json_key.getNameKey()];
        var desc = reqData[json_key.getDescKey()];
        var size = reqData[json_key.getSizeKey()];

        wrapper.promiseWrapper(cc_task.getMonAppInstPacket, 2000, name, desc, size, function(err, result){
            util.printLog(module_name + ' onParseMonAppInst result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildMonAppInstRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseMonUserActInst: function(reqPacket, owner) {
        var that = this;
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildMonUserActInstCmdId()) {
            return 0;
        }

        var user_name = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.getMonUserActInstPacket, 2000, user_name, function(err, result){
            util.printLog(module_name + ' onParseMonUserActInst result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildMonUserActInstRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseMonChangeAppFilter: function(reqPacket, owner){
        var that = this;
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildMonChangeAppFilterCmdId()) {
            return 0;
        }
        var reqData = reqPacket[json_key.getDataKey()];

        var file_name = reqData[json_key.getNameKey()];
        var file_desc = reqData[json_key.getDescKey()];
        var file_size = reqData[json_key.getSizeKey()];
        var is_add = reqData[json_key.getIsAddKey()];

        wrapper.promiseWrapper(cc_task.getMonChangeAppFilterPacket, 2000, file_name, file_desc, file_size, is_add, function(err, result){
            util.printLog(module_name + ' onParseMonChangeAppFilter result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildMonChangeAppFilterRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeCfgGlobalPswd: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeCfgGlobalPswdCmdId()) {
            return 0;
        }

        var pswd = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.changeCfgGlobalPswd, 2000, pswd, function(err, result){
            util.printLog(module_name + ' onParseChangeCfgGlobalPswd result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeCfgGlobalPswdRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeCfgGlobalCCPort: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeCfgGlobalCCPortCmdId()) {
            return 0;
        }

        var port = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.changeCfgGlobalCCPort, 2000, port, function(err, result){
            util.printLog(module_name + ' onParseChangeCfgGlobalCCPort result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeCfgGlobalCCPortRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeCfgAsAccountAdmin: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeCfgAsAccountAdminCmdId()) {
            return 0;
        }

        var status = reqPacket[json_key.getStatusKey()];

        wrapper.promiseWrapper(cc_task.changeCfgAsAccountAdmin, 2000, status, function(err, result){
            util.printLog(module_name + ' onParseChangeCfgAsAccountAdmin result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeCfgAsAccountAdminRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeCfgAsDesktopDeny: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeCfgAsDesktopDenyCmdId()) {
            return 0;
        }

        var status = reqPacket[json_key.getStatusKey()];

        wrapper.promiseWrapper(cc_task.changeCfgAsDesktopDeny, 2000, status, function(err, result){
            util.printLog(module_name + ' onParseChangeCfgAsDesktopDeny result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeCfgAsDesktopDenyRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeCfgAsRdpPort: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeCfgAsRdpPortCmdId()) {
            return 0;
        }

        var port = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.changeCfgAsRdpPort, 2000, port, function(err, result){
            util.printLog(module_name + ' onParseChangeCfgAsRdpPort result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeCfgAsRdpPortRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseChangeCfgAsPollPeriod: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildChangeCfgAsPollPeriodCmdId()) {
            return 0;
        }

        var val = reqPacket[json_key.getDataKey()];

        wrapper.promiseWrapper(cc_task.changeCfgAsPollPeriod, 2000, val, function(err, result){
            util.printLog(module_name + ' onParseChangeCfgAsPollPeriod result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildChangeCfgAsPollPeriodRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });
    },

    onParseAppImage: function(reqPacket, owner) {
        var resPacketData = {};

        var cmdid = reqPacket[json_key.getCmdIdKey()];

        if (cmdid != child_packet.getChildAppImageCmdId()) {
            return 0;
        }

        var list = reqPacket[json_key.getListKey()];

        if (list.length < 1) {
            return 0;
        }
        var itemData = list[0];

        var ip = itemData.ip;
        var app_full_file = itemData.app_full_file;

        wrapper.promiseWrapper(cc_task.getAppImage, 2000, ip, app_full_file, function(err, result) {

            util.printLog(module_name + ' getAppImage result', result);

            var module_id = 0;
            var errno = 0;
            var errmsg = '';
            var res_list = null;
            if (err) {
                errno = 1;
                errmsg = err;
            }
            else {
                errno = 0;
                errmsg = '成功';
                res_list = result;
            }
            resPacketData = child_packet.getChildAppImageRespPacket(module_id, errno, errmsg, res_list);

            owner.send(JSON.stringify(resPacketData));

            return 1;
        });

        return 1;
    }

}

module.exports = obj;
