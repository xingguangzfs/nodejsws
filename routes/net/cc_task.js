/**
 * Created by fushou on 2019/4/30.
 */

var json_key = require('../../common/json_key');
var util = require('../../common/util');

var cc_task = {

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

    // addUser : 添加一个用户
    addUser: function(user_name, status, callback) {
        var that = this;
        if (user_name.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};

        var accounts = [
            {
                uname: user_name,
                status: status
            }
        ];

        // 添加帐户
        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.addusers(accounts, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '创建系统账户成功';

        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '创建系统账户失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }

        return true;
    },

    // delUser : 删除一个用户
    delUser: function(user_name, callback) {
        var that = this;
        if (user_name.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            var unames = [user_name];
            cc_op.delusers(unames, callback);
            // 删除成功

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '删除成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '删除失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task delUser: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeUser: 修改一个用户
    changeUser: function(user_name, status, callback) {
        var that = this;
        if (user_name.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};

        var accounts = [
            {
                uname: user_name,
                status: status
            }
        ];

        util.printLog('cc_task changeUser', accounts);

        // 修改帐户
        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeusers(accounts, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改系统账户成功';

        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改系统账户失败';
            if (callback) {
                callback(null, [resData]);
            }
        }
        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // addAsHost : 添加一台AS主机
    addAsHost: function(ip_addr, status, callback) {
        var that = this;
        if (ip_addr.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};
        var hosts = [
            {
                ip_addr: ip_addr,
                status: status
            }
        ]

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.addas(hosts, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '创建AS主机成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '创建AS主机失败';
            if (callback) {
                callback(null, resData);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // delAsHost: 删除一台AS主机
    delAsHost: function(ip_addr, callback) {
        var that = this;
        if (ip_addr.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            var ip_addrs = [ip_addr];
            cc_op.delas(ip_addrs, callback);
            // 删除成功

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '删除成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '删除失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task delAsHost: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeAsHost : 修改一台AS主机
    changeAsHost: function(old_ip_addr, old_status, new_ip_addr, new_status, callback) {
        var that = this;
        if (old_ip_addr.length < 1 || new_ip_addr.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};

        var hosts = [
            {
                old_ip_addr: old_ip_addr,
                old_status: old_status,
                new_ip_addr: new_ip_addr,
                new_status: new_status
            }
        ];

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeas(hosts, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改AS主机成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改AS主机失败';
            if (callback) {
                callback(null, [resData]);
            }
        }
        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // discoverAsHost
    discoverAsHost: function(callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.discoveras(callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '自动发现AS主机成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '自动发现AS主机失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getAsLoad : 获取AS主机负载
    getAsLoad: function(ip_addrs, callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getAsLoad(ip_addrs, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取所有AS主机负载成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取所有AS主机负载失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getUserActive : 获取用户活跃状态信息
    // unames : 用户名列表
    getUserActive: function(unames, callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getUserActive(unames, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取所有用户活跃信息成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取所有用户活跃信息失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getMonUser : 获取监控用户信息
    getMonUser: function(callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getMonUser(callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取监控用户信息成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取监控用户信息失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getMonHost : 获取监控主机信息
    getMonHost: function(callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getMonHost();

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取监控主机信息成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取监控主机信息失败';
        }

        if (callback) {
            callback(null, [resData]);
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getMonApp : 获取监控应用信息
    getMonApp: function(callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getMonApp(callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取监控应用信息成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取监控应用信息失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // 获取应用实例信息
    getMonAppInstPacket: function(exe_file_name, file_desc, file_size, callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getMonAppInstPacket(exe_file_name, file_desc, file_size, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取监控应用实例成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取监控应用实例失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // 获取用户活动实例信息
    getMonUserActInstPacket: function(user_name, callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getMonUserActInstPacket(user_name, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取监控用户活动实例成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取监控用户活动实例失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getMonChangeAppFilterPacket : 修改监控应用过滤信息
    getMonChangeAppFilterPacket: function(file_name, file_desc, file_size, is_add, callback) {
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getMonChangeAppFilterPacket(file_name, file_desc, file_size, is_add, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改监控应用过滤成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改监控应用过滤失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeCfgGlobalPswd : 修改全局配置主机密码
    changeCfgGlobalPswd: function(pswd, callback) {
        var that = this;

        if (pswd == null || pswd.length < 1) {
            that.normalAck(0, callback);
            return false;
        }
        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeCfgGlobalPswd(pswd, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task changeCfgGlobalPswd: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeCfgGlobalCCPort : 修改全局配置CC通讯端口号
    changeCfgGlobalCCPort: function(port, callback) {
        var that = this;

        if (port < 1024) {
            that.normalAck(0, callback);
            return false;
        }

        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeCfgGlobalCCPort(port, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task changeCfgGlobalCCPort: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeCfgAsAccountAdmin : 修改配置AS主机账户管理员权限
    changeCfgAsAccountAdmin: function(status, callback) {
        var that = this;

        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeCfgAsAccountAdmin(status, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task changeCfgAsAccountAdmin: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeCfgAsDesktopDeny : 修改配置AS桌面登录模式
    changeCfgAsDesktopDeny: function(status, callback) {
        var that = this;

        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeCfgAsDesktopDeny(status, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task changeCfgAsDesktopDeny: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeCfgAsRdpPort : 修改AS主机RDP服务端口
    changeCfgAsRdpPort: function(port, callback) {
        var that = this;

        if (port < 1024) {
            that.normalAck(0, callback);
            return false;
        }

        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeCfgAsRdpPort(port, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task changeCfgAsRdpPort: ' + JSON.stringify(resData));
        }
        return true;
    },

    // changeCfgAsPollPeriod : 修改AS主机采集频率
    changeCfgAsPollPeriod: function(val, callback) {
        var that = this;

        if (val < 1) {
            that.normalAck(0, callback);
            return false;
        }

        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.changeCfgAsPollPeriod(val, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '修改成功';
        }
        else {
            // 删除失败
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '修改失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task changeCfgAsPollPeriod: ' + JSON.stringify(resData));
        }
        return true;
    },

    // getAppImage : 获取应用图标
    getAppImage: function(ip, app_full_file, callback) {
        var that = this;

        console.log('getAppImage ip: ' + JSON.stringify(ip));
        console.log('getAppImage file: ' + JSON.stringify(app_full_file));

        if (ip == null || ip.length < 1 ||
            app_full_file == null || app_full_file.length < 1) {
            that.normalAck(0, callback);
            return false;
        }

        var resData = {};

        var cc_op = util.GetCCOP();
        if (cc_op != null && cc_op != undefined) {
            cc_op.getAppImage(ip, app_full_file, callback);

            resData[json_key.getStatusKey()] = 1;
            resData[json_key.getMsgKey()] = '获取应用图标成功';
        }
        else {
            resData[json_key.getStatusKey()] = 0;
            resData[json_key.getMsgKey()] = '获取应用图标失败';
            if (callback) {
                callback(null, [resData]);
            }
        }

        if (global.print_log) {
            console.log('cc task res: ' + JSON.stringify(resData));
        }
        return true;
    }


}

module.exports = cc_task;
