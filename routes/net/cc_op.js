/**
 * Created by fushou on 2019/4/29.
 */

var util = require('../../common/util');
// xml
var dom = require('xmldom').DOMParser;
var sel = require('xpath.js');
var fr = require('fs');

//var tcp_client = require('./tcp_client');

//var cc_filter = require('./cc_filter');
var cc_data = require('./cc_data');

var cc_buffer = require('./cc_buffer');
var recv_buffer = new cc_buffer(1024);

// cc配置信息
var data = fr.readFileSync("../bin/config.xml", "utf-8");
var xmldoc = new dom().parseFromString(data);

var item = sel(xmldoc, "/root/cc/host/text()");
var host = item.toString();

item = sel(xmldoc, "/root/cc/port/text()");
var port = item.toString();

//var port = 3390;
//var host = '192.168.0.3';

var cc_op = {
    tcp_client: require('./tcp_client'),
    filter: require('./cc_filter'),
    is_running: false, // 运行状态

    onSetFilterCompleted: function(callback) {
        var that = this;
        that.filter.onSetCompleted(callback);
    },

    // 启动连接
    start: function() {
        var that = this;

        that.connect();
    },

    setRunning: function(val) {
      var that = this;

        that.is_running = val;
    },

    getRunning: function() {
        var that = this;
        return that.is_running;
    },

    connect: function() {
        var that = this;

        that.setRunning(false);
        recv_buffer.reset();

        util.printLog('cc_op', 'test connect to ' + host + ':' + port);

        that.tcp_client.connect(port, host, function(){
            console.log('cc connect to ' + host + ' : ' + port + ' success...');

            // 注册
            that.regist();
        });

        // 注册处理函数
        that.tcp_client.onrecv(function(res){
            util.printLog('cc_op recv source data length', res.length);

            // 处理粘包
            var resBuffer = Buffer.from(res, 'binary'); //
            recv_buffer.putData(resBuffer, function(err, data){
                if (err) {
                    util.printLog('cc_op onrecv error', err);
                }
                else if (data) {
                    // data 可以等于 null ，代表此次处理完成，防止请求被挂起
                    that.filter.onRecv(data);
                }
            });
        });

        that.tcp_client.onerror(function(err){
            util.printLog('cc_op', 'tcp client error occurred.');

            that.filter.onError(err);

            that.setRunning(false);

            // 关闭连接
            that.tcp_client.ondestroy();
        });

        that.tcp_client.onclose(function(){
            // 重新连接
            util.printLog('cc_op', 'tcp is closed, connect abnormal disconnect, per 30 seconds reconnect.');
            var tm = setTimeout(function(){
                // 重新连接
                that.tcp_client.connect(port, host, function(){
                    console.log('cc connect to ' + host + ' : ' + port + ' success...');
                    // 注册
                    that.regist();
                });

                clearTimeout(tm);
                tm = null;
            }, 30 * 1000);
        });
    },

    // 停止
    stop: function() {
        var that = this;

        that.setRunning(false);
        that.tcp_client.ondestroy();
    },

    // 注册
    regist: function() {
        var that = this;
        var pkt = cc_data.getConnectPacket();
        if (pkt != null) {
            that.tcp_client.onsend(pkt, 'utf8', function() {
                util.printLog('cc_op', 'cc regist complete.');

                that.setRunning(true);
            });
        }
        else {
            util.printLog('cc_op','getConnectPacket function fail.');
        }
    },

    normalAck: function(status, callback) {
        var resData = {};
        resData['status'] = status;
        resData['msg'] = (status == 1 ? '成功' : '失败');

        if (callback) {
            var list = [
                resData
            ]

            callback(null, list);
        }
    },

    checkConnected: function() {
        var that = this;

        return (that.getRunning() ? true : false);
    },

    // 心跳应答包
    activeTestAsk: function() {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_op', 'activeTestAsk function fail, tcp disconnected.');
            return;
        }

        var pkt =cc_data.getActiveTestRespPacket();
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op activeTestAsk strpkt', strpkt);

            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc activeTestAsk complete.');
            })
        }
        else {
            util.printLog('cc_op', 'activeTestAsk function fail.');
        }
    },

    // 添加用户
    // accounts: [{"uname": "test1","status":1},{"uname":"test2","status":1}]
    addusers: function(accounts, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_op', 'adduser function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return ;
        }

        var pkt = cc_data.getAddUserPacket(accounts);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op adduser strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc adduser complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'adduser function fail.');
            that.normalAck(0, callback);
        }
    },

    // 删除用户
    // unames: ['test1','test2']
    delusers: function(unames, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'deluser function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getDelUserPacket(unames);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op deluser strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc deluser complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_log', 'deluser function fail.');
            that.normalAck(0, callback);
        }
    },

    // 修改用户
    changeusers: function(accounts, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeusers function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getChangeUserPacket(accounts);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeuser strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeuser complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeuser function fail.');
            that.normalAck(0, callback);
        }
    },

    // 添加AS主机
    addas: function(hosts, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'addas function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getAddAsPacket(hosts);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op addas strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc addas complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'addas function fail.');
            that.normalAck(0, callback);
        }
    },

    // 删除AS主机
    delas: function(ip_addrs, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'delas function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getDelAsPacket(ip_addrs);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op delas strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc delas complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'delas function fail.');
            that.normalAck(0, callback);
        }
    },

    // 修改AS主机
    changeas: function(hosts, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeas function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getChangeAsPacket(hosts);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeas strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeas complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeas function fail.');
            that.normalAck(0, callback);
        }
    },

    // 自动发现AS主机
    discoveras: function(callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'discoveras function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getDiscoverAsPacket();
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op discoveras strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc discoveras complete.');
            })
        }
        else {
            util.printLog('cc_op', 'discover function fail.');
            that.normalAck(0, callback);
        }
    },

    // getAsLoad : 获取所有AS主机负载
    // ip_addrs参数说明，如果为空，代表获取全部，不为空为IP地址数组
    getAsLoad: function(ip_addrs, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getAsLoad function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getAsLoadPacket(ip_addrs);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getAsLoad strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getAsLoad complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getAsLoad function fail.');
        }
    },

    // getUserActive : 获取用户活跃状态信息
    getUserActive: function(unames, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getUserActive function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getUserActivePacket(unames);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getUserActive strpkt', strpkt);

            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getUserActive complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getUserActive function fail.');
        }
    },

    // getMonUser: 获取用户监控
    getMonUser: function(callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getMonUser function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt =cc_data.getMonUserPacket();
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getMonUser strpkt', strpkt);

            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getMonUser complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getMonUser function fail.');
        }
    },

    // getMonHost: 获取主机监控
    getMonHost: function() {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getMonHost function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt =cc_data.getMonHostPacket();
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getMonHost strpkt', strpkt);

            that.onSetFilterCompleted(null);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getMonHost complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getMonHost function fail.');
        }
    },

    // getMonApp: 获取应用监控
    getMonApp: function(callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getMonApp function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt =cc_data.getMonAppPacket();
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getMonApp strpkt', strpkt);

            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getMonApp complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getMonApp function fail.');
        }
    },

    // 获取应用实例信息
    getMonAppInstPacket: function(exe_file_name, file_desc, file_size, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getMonAppInstPacket function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getMonAppInstPacket(exe_file_name, file_desc, file_size);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getMonAppInstPacket strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getMonAppInstPacket complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getMonAppInstPacket function fail.');
            that.normalAck(0, callback);
        }
    },

    // 获取用户活动实例信息
    getMonUserActInstPacket: function(user_name, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getMonUserActInstPacket function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        util.printLog('getMonUserActInstPacket param', user_name);

        var pkt = cc_data.getMonUserActInstPacket(user_name);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getMonUserActInstPacket strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getMonUserActInstPacket complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getMonUserActInstPacket function fail.');
            that.normalAck(0, callback);
        }
    },

    // getMonChangeAppFilterPacket : 获取修改监控应用过滤
    getMonChangeAppFilterPacket: function(file_name, file_desc, file_size, is_add, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getMonChangeAppFilterPacket function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getMonChangeAppFilterPacket(file_name, file_desc, file_size, is_add);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getMonChangeAppFilterPacket strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getMonChangeAppFilterPacket complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'getMonChangeAppFilterPacket function fail.');
            that.normalAck(0, callback);
        }
    },

    // changeCfgGlobalPswd : 修改全局配置主机密码
    changeCfgGlobalPswd: function(pswd, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeCfgGlobalPswd function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getCfgGlobalPswdPacket(pswd);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeCfgGlobalPswd strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeCfgGlobalPswd complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeCfgGlobalPswd function fail.');
            that.normalAck(0, callback);
        }
    },

    // changeCfgGlobalCCPort : 修改全局配置CC通讯端口
    changeCfgGlobalCCPort: function(port, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeCfgGlobalCCPort function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getCfgGlobalCCPortPacket(port);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeCfgGlobalCCPort strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeCfgGlobalCCPort complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeCfgGlobalCCPort function fail.');
            that.normalAck(0, callback);
        }
    },

    // changeCfgAsAccountAdmin : 修改AS主机账号管理员权限
    changeCfgAsAccountAdmin: function(status, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeCfgAsAccountAdmin function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getCfgAsAccountAdminPacket(status);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeCfgAsAccountAdmin strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeCfgAsAccountAdmin complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeCfgAsAccountAdmin function fail.');
            that.normalAck(0, callback);
        }
    },

    // changeCfgAsDesktopDeny : 修改AS主机禁用桌面模式
    changeCfgAsDesktopDeny: function(status, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeCfgAsDesktopDeny function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getCfgAsDesktopDenyPacket(status);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeCfgAsDesktopDeny strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeCfgAsDesktopDeny complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeCfgAsDesktopDeny function fail.');
            that.normalAck(0, callback);
        }
    },

    // changeCfgAsRdpPort : 修改AS主机RDP端口号
    changeCfgAsRdpPort: function(port, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeCfgAsRdpPort function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getCfgAsRdpPortPacket(port);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeCfgAsRdpPort strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeCfgAsRdpPort complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeCfgAsRdpPort function fail.');
            that.normalAck(0, callback);
        }
    },

    // changeCfgAsPollPeriod : 修改AS主机数据采集频率
    changeCfgAsPollPeriod: function(val, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'changeCfgAsPollPeriod function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getCfgAsPollPeriodPacket(val);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op changeCfgAsPollPeriod strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc changeCfgAsPollPeriod complete.');
                that.normalAck(1, callback);
            })
        }
        else {
            util.printLog('cc_op', 'changeCfgAsPollPeriod function fail.');
            that.normalAck(0, callback);
        }
    },

    // getAppImage : 获取应用图标
    getAppImage: function(ip, app_full_file, callback) {
        var that = this;

        if (!that.checkConnected()) {
            util.printLog('cc_log', 'getAppImage function fail, tcp disconnected.');
            that.normalAck(0, callback);
            return;
        }

        var pkt = cc_data.getAppImagePacket(ip, app_full_file);
        if (pkt != null) {
            var strpkt = pkt.toString('hex');
            util.printLog('cc_op getAppImage strpkt', strpkt);
            that.onSetFilterCompleted(callback);
            that.tcp_client.onsend(pkt, 'utf8', function(){
                util.printLog('cc_op', 'cc getAppImage complete.');
            })
        }
        else {
            util.printLog('cc_op', 'getAppImage function fail.');
            that.normalAck(0, callback);
        }
    }

};

module.exports = cc_op;
