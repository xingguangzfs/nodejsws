/**
 * Created by fushou on 2019/4/29.
 */

var cc_packet_head_len = 16; // 包头长度16个字节

var max_user_count = 1000;

var max_recv_buf_len = 65536;
var min_pack_len = 12;
var max_pack_len = 65536;

var max_field_name_len = 100;
var max_field_ip_len = 16;

var capp_version = 0; // 当前版本号

// 子系统类型
var client_type_uk = 0; // 未知
var client_type_ws = 1;
var client_type_as = 2;
var client_type_ss = 3;
var client_type_cs = 4;
var client_type_dc = 5;

// 信令ID
var capp_active_test = 0x0000000; // 心跳包
var capp_active_test_resp = 0x80000000;

var capp_connect = 0x00000001;
var capp_connect_resp = 0x80000001;
var capp_terminate = 0x00000002;
var capp_terminate_resp = 0x80000002;
var capp_handshake = 0x00000003;
var capp_handshake_resp = 0x80000003;

var capp_res_user_list = 0x00000100; // 用户列表
var capp_res_user_list_resp = 0x80000100;
var capp_user_add = 0x00000101; // 添加用户（可同时添加多个）
var capp_user_del = 0x00000102; // 删除用户（可同时删除多个）
var capp_user_change = 0x00000103; // 用户状态修改

var capp_host_add = 0x00000200; // 添加主机
var capp_host_del = 0x00000201; // 删除主机
var capp_host_change = 0x00000202; // 主机状态修改
var capp_host_discover = 0x00000203; // 主机自动发现
var capp_host_discover_resp = 0x80000203; // 主机自动发现应答

var capp_app_icon = 0x00000300; // 应用图标
var capp_app_icon_resp = 0x80000300;

/* 监控应用过滤 */
var capp_mon_app_filter_add = 0x00001301; // 监控应用过滤添加
var capp_mon_app_filter_delete = 0x00001302; // 监控应用过滤删除

/* 实时数据查询 */
var capp_host_load = 0x00002000; // AS负载请求
var capp_host_load_resp = 0x80002000; // AS负载应答

var capp_user_active = 0x00002001; // 用户活跃信息
var capp_user_active_resp = 0x80002001;

var capp_app_list = 0x00002002; // 被打开应用列表查询
var capp_app_list_resp = 0x80002002;

var capp_app_inst = 0x00002003; // 应用实例查询
var capp_app_inst_resp = 0x80002003; // 应用实例查询应答

var capp_user_active_list = 0x00002004; // 登录用户列表查询
var capp_user_active_list_resp = 0x80002004;

var capp_app_user_act_inst = 0x00002005; // 用户活动实例查询
var capp_app_user_act_inst_resp = 0x80002005; // 用户启动实例查询应答

/* 监控 */
var capp_mon_host = 0x00003000; // 主机监控查询请求
var capp_mon_host_resp = 0x80003000; // 主机监控查询应答

/* 管理配置 */
var capp_cfg_global_var1 = 0x00001100; // AS登录密码
var capp_cfg_global_var2 = 0x00001101; // CC通讯端口

var capp_cfg_global_as_var1 = 0x00001200; // 账号具有管理员权限标志
var capp_cfg_global_as_var2 = 0x00001201; // 禁用桌面模式
var capp_cfg_global_as_var3 = 0x00001202; // RDP商品号
var capp_cfg_global_as_var4 = 0x00001203; // 采集频率

var cc_data = {

    getActiveTestCmdId: function() {
      return capp_active_test;
    },

    getDiscoverHostRespCmdId: function() {
        return capp_host_discover_resp;
    },

    getHostLoadRespCmdId: function() {
        return capp_host_load_resp;
    },

    getUserActiveRespCmdId: function() {
        return capp_user_active_resp;
    },

    getMonUserRespCmdId: function () {
        return capp_user_active_list_resp;
    },

    getMonHostRespCmdId: function() {
        return capp_mon_host_resp;
    },

    getAppImageRespCmdId: function() {
        return capp_app_icon_resp;
    },

    getMonAppRespCmdId: function() {
        return capp_app_list_resp;
    },

    getMonAppInstRespCmdId: function() {
        return capp_app_inst_resp;
    },

    getMonUserActInstRespCmdId: function() {
        return capp_app_user_act_inst_resp;
    },

    getFieldIpMaxLen: function() {
        return max_field_ip_len;
    },

    getFieldNameMaxLen: function() {
        return max_field_name_len;
    },

    getFullPathMaxLen: function() {
        var MAX_PATH = 260;
        return (2 * MAX_PATH);
    },

    getStringTimeMaxLen: function() {
        return 20;
    },

    // 返回包头长度
    getPacketHeadLen: function () {
        return cc_packet_head_len;
    },

    // 分配缓冲区
    getBuffer: function(buf_len) {
        var buff = Buffer.alloc(buf_len, 0, 'binary');
        return buff;
    },

    // 分配缓冲区
    getBuffer2: function(buf_len, fill, encoding) {
        var buff = Buffer.alloc(buf_len, fill, encoding);
        return buff;
    },

    // 向缓冲区写入包头信息
    writePacketHead: function(buff, len, cmdid) {
        buff.writeUInt32LE(len, 0, true);
        buff.writeUInt32LE(capp_version, 4, true);
        buff.writeUInt32LE(cmdid, 8, true);
        buff.writeUInt32LE(8, 12, true); // format: 0 ascii, 8 utf8
    },

    // 向缓冲区指定位置写入32位整数值
    writePacketInt32: function(buff, offset, value) {
      buff.writeUInt32LE(value, offset, true);
    },

    // 写字符串
    writeString: function(buff, offset, value) {
        var len = Buffer.byteLength(value);
        buff.write(value, offset, len, 'utf8'); // utf8
    },

    writeString2: function(buff, offset, value, charset) {
        var len = Buffer.byteLength(value);
        buff.write(value, offset, len, charset);
    },

    // 心跳应答包
    getActiveTestRespPacket: function() {
        var buf_len = this.getPacketHeadLen();
        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }
        this.writePacketHead(buff, buf_len, capp_active_test_resp);

        return buff;
    },

    // 连接请求包
    getConnectPacket: function() {
        var buf_len = this.getPacketHeadLen() + 62;
        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }
        this.writePacketHead(buff, buf_len, capp_connect);

        // 子系统类型
        this.writePacketInt32(buff, this.getPacketHeadLen(), client_type_ws);

        return buff;
    },

    // 添加用户包
    getAddUserPacket: function(accounts) {
        var count = accounts.length;
        if (count < 1) {
            return null;
        }

        console.log("getAddUserPacket param: " + JSON.stringify(accounts));

        // 包头 + 账户个数(4 bytes) + 账户数据列表[用户名(100 bytes) + 状态(4 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4 + count * (max_field_name_len + 4);

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_user_add);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        for(var idx = 0; idx < count; idx++) {
            var itemData = accounts[idx];

            var uname = itemData.uname;
            var status = itemData.status;

            var offset = head_len + 4 + idx * (max_field_name_len + 4);
            this.writeString(buff, offset, uname);
            this.writePacketInt32(buff, offset + max_field_name_len, status);
        }

        return buff;
    },

    // 删除用户包
    getDelUserPacket: function(unames) {
        var count = unames.length;
        if (count < 1) {
            return null;
        }
        // 包头 + 账户个数(4 bytes) + 账户数据列表[用户名(50 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4 + count * max_field_name_len;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_user_del);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        for(var idx = 0; idx < count; idx++) {
            var uname = unames[idx];

            var offset = head_len + 4 + idx * max_field_name_len;
            this.writeString(buff, offset, uname);
        }

        return buff;
    },

    // 修改用户包
    getChangeUserPacket: function(accounts) {
        var count = accounts.length;
        if (count < 1) {
            return null;
        }

        // 包头 + 账户个数(4 bytes) + 账户数据列表[用户名(50 bytes) + 状态(4 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4 + count * (max_field_name_len + 4);

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_user_change);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        for(var idx = 0; idx < count; idx++) {
            var itemData = accounts[idx];

            var uname = itemData.uname;
            var status = itemData.status;

            var offset = head_len + 4 + idx * (max_field_name_len + 4);
            this.writeString(buff, offset, uname);
            this.writePacketInt32(buff, offset + max_field_name_len, status);
        }

        return buff;
    },

    // 添加AS主机包
    getAddAsPacket: function(hosts) {
        var count = hosts.length;
        if (count < 1) {
            return null;
        }

        // 包头 + 账户个数(4 bytes) + 主机列表[IP地址(16 bytes) + 状态(4 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + (max_field_ip_len + 4);

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_host_add);

        for(var idx = 0; idx < 1; idx++) {
            var itemData = hosts[idx];

            var ip_addr = itemData.ip_addr;
            var status = itemData.status;

            var offset = head_len + idx * (max_field_ip_len + 4);
            this.writeString(buff, offset, ip_addr);
            this.writePacketInt32(buff, offset + max_field_ip_len, status);
        }

        return buff;
    },

    // 删除AS主机
    getDelAsPacket: function(ip_addrs) {
        var count = ip_addrs.length;
        if (count < 1) {
            return null;
        }
        // 包头 + 账户个数(4 bytes) + 账户数据列表[IP地址(16 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + max_field_ip_len;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_host_del);

        for(var idx = 0; idx < 1; idx++) {
            var ip_addr = ip_addrs[idx];

            var offset = head_len + idx * max_field_ip_len;
            this.writeString(buff, offset, ip_addr);
        }

        return buff;
    },

    // 修改AS主机包
    getChangeAsPacket: function(hosts) {
        var count = hosts.length;
        if (count < 1) {
            return null;
        }

        // 包头 + 账户数据列表[旧IP地址(16 bytes) + 旧状态(4 bytes) + 新IP地址(16 bytes) + 新状态(4 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 2 * (max_field_ip_len + 4);

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_host_change);

        for(var idx = 0; idx < 1; idx++) {
            var itemData = hosts[idx];

            var old_ip_addr = itemData.old_ip_addr;
            var old_status = itemData.old_status;
            var new_ip_addr = itemData.new_ip_addr;
            var new_status = itemData.new_status;

            var offset = head_len + idx * 2 * (max_field_ip_len + 4);

            this.writeString(buff, offset, old_ip_addr);

            offset += max_field_ip_len;
            this.writePacketInt32(buff, offset, old_status);

            offset += 4;
            this.writeString(buff, offset, new_ip_addr);

            offset += max_field_ip_len;
            this.writePacketInt32(buff, offset, new_status);
        }

        return buff;
    },

    // 获取自动控制发现主机请求包
    getDiscoverAsPacket: function() {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_host_discover);

        return buff;
    },

    // 获取AS主机负载包
    getAsLoadPacket: function(ip_addrs) {
        var count = 0;
        if (ip_addrs != undefined && ip_addrs!= null && ip_addrs.length > 0) {
            count = ip_addrs.length;
        }

        // 包头 + 账户个数(4 bytes) + 账户数据列表[IP地址(16 bytes) + 状态(4 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4 + count * (max_field_ip_len);

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_host_load);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        for(var idx = 0; idx < count; idx++) {
            var ip_addr = ip_addrs[idx];

            var offset = head_len + 4 + idx * (max_field_ip_len);
            this.writeString(buff, offset, ip_addr);
        }

        return buff;
    },

    // 获取用户活跃信息列表
    getUserActivePacket: function(unames) {
        var count = 0;
        if (unames != undefined && unames!= null && unames.length > 0) {
            count = unames.length;
        }

        // 包头 + 账户个数(4 bytes) + 用户名称数据列表[用户名称(50 bytes)]
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4 + count * (max_field_name_len);

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_user_active);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        for(var idx = 0; idx < count; idx++) {
            var uname = unames[idx];

            var offset = head_len + 4 + idx * (max_field_name_len);
            this.writeString(buff, offset, uname);
        }

        return buff;
    },

    // 获取用户列表信息
    getMonUserPacket: function() {
        var count = 0;

        // 包头 + 个数(4 bytes)
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_user_active_list);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        return buff;
    },

    // 获取主机列表信息
    getMonHostPacket: function() {
        var count = 0;
        // 包头 + 个数(4 bytes)
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_mon_host);
        this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        return buff;
    },

    // 获取应用列表信息
    getMonAppPacket: function() {
        var count = 0;

        // 包头 + 个数(4 bytes)
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_app_list);
        //this.writePacketInt32(buff, head_len, count); // count (4 bytes)

        return buff;
    },

    // 获取应用实例信息
    getMonAppInstPacket: function(exe_file_name, file_desc, file_size) {
        // 包头 + 文件名(100 bytes) + 文件描述(100 bytes) + size (4 bytes)
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 2 * this.getFieldNameMaxLen() + 4;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        var charset = 'utf8';
        var offset = 0;

        this.writePacketHead(buff, buf_len, capp_app_inst);

        offset = head_len;
        this.writeString2(buff, offset, exe_file_name, charset);

        offset += this.getFieldNameMaxLen();
        this.writeString2(buff, offset, file_desc, charset);

        offset += this.getFieldNameMaxLen();
        this.writePacketInt32(buff, offset, file_size);

        return buff;
    },

    // 获取用户活动实例信息
    getMonUserActInstPacket: function(user_name) {
        // 包头 + 用户名(50 bytes)
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + this.getFieldNameMaxLen();

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        var charset = 'utf8';
        var offset = 0;

        this.writePacketHead(buff, buf_len, capp_app_user_act_inst);

        offset = head_len;
        this.writeString2(buff, offset, user_name, charset);

        return buff;
    },

    // 修改监控应用过滤表
    getMonChangeAppFilterPacket: function(file_name, file_desc, file_size, is_add) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 2 * this.getFieldNameMaxLen() + 4;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        var charset = 'utf8';
        var offset = 0;

        if (is_add == 0) {
            // 删除
            this.writePacketHead(buff, buf_len, capp_mon_app_filter_delete);
        }
        else {
            // 添加
            this.writePacketHead(buff, buf_len, capp_mon_app_filter_add);
        }

        // file_name
        offset = head_len;
        this.writeString2(buff, offset, file_name, charset);

        // file_desc
        offset += this.getFieldNameMaxLen();
        this.writeString2(buff, offset, file_desc, charset);

        // file_size
        offset += this.getFieldNameMaxLen();
        this.writePacketInt32(buff, offset, file_size);

        return buff;
    },

    // 获取全局配置AS登录密码修改请求包
    getCfgGlobalPswdPacket: function(pswd) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + max_field_name_len;

        var buff = this.getBuffer(buf_len);
        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_cfg_global_var1);
        this.writeString(buff, head_len, pswd);

        return buff;
    },

    // 获取全局配置CC通讯端口修改请求包
    getCfgGlobalCCPortPacket: function(port) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);

        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_cfg_global_var2);
        this.writePacketInt32(buff, head_len, port);

        return buff;
    },

    // 获取AS配置账号管理员权限标志
    getCfgAsAccountAdminPacket: function(status) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);

        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_cfg_global_as_var1);
        this.writePacketInt32(buff, head_len, status);

        return buff;
    },

    // 获取AS配置禁止桌面模式标志
    getCfgAsDesktopDenyPacket: function(status) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);

        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_cfg_global_as_var2);
        this.writePacketInt32(buff, head_len, status);

        return buff;
    },

    // 获取AS配置RDP商品
    getCfgAsRdpPortPacket: function(port) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);

        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_cfg_global_as_var3);
        this.writePacketInt32(buff, head_len, port);

        return buff;
    },

    // 获取AS采集频率
    getCfgAsPollPeriodPacket: function(val) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 4;

        var buff = this.getBuffer(buf_len);

        if (buff == null) {
            return null;
        }

        this.writePacketHead(buff, buf_len, capp_cfg_global_as_var4);
        this.writePacketInt32(buff, head_len, val);

        return buff;
    },

    // getAppImagePacket : 获取应用图标请求包
    getAppImagePacket: function(ip, app_full_path) {
        var head_len = this.getPacketHeadLen();
        var buf_len = head_len + 16 + 1024;

        var buff = this.getBuffer(buf_len);

        if (buff == null) {
            return null;
        }
        var charset = 'utf8';

        var offset;
        this.writePacketHead(buff, buf_len, capp_app_icon);

        offset = head_len;
        this.writeString2(buff, offset, ip, charset);

        offset += 16;
        this.writeString2(buff, offset, app_full_path, charset);

        return buff;
    }

}

module.exports = cc_data;
