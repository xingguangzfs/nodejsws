/**
 * Created by fushou on 2019/6/13.
 */

var util = require('../../common/util');
var json_key = require('../../common/json_key');
var cc_data = require('./cc_data');

var child_packet = require('../child/child_packet');

var module_name = 'cc_filter';

function getMapList() {
    return util.GetMapList();
}

function getMapListKey(cmdid) {
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
}

function sendMapListData(cmdid, datas) {
    if (datas == null || datas == undefined || datas.length < 1) {
        return ;
    }

    var map_list = getMapList();
    var map_key = getMapListKey(cmdid);
    var item_array = map_list.getItem(map_key);

    var module_id = 2;
    var errno = 0;
    var errmsg = '';

    if (item_array != null && item_array.count() > 0) {

        var item_list = item_array.get();

        for(var idx = 0; idx < item_list.length; idx++) {
            var owner = item_list[idx];

            switch(cmdid) {
                case child_packet.getChildMonUserCmdId(): {
                    var resPacketData = child_packet.getChildMonUserRespPacket(module_id, errno, errmsg, datas);
                    owner.send(JSON.stringify(resPacketData));
                }break;

                case child_packet.getChildMonHostCmdId(): {
                    var resPacketData = child_packet.getChildMonHostRespPacket(module_id, errno, errmsg, datas);
                    owner.send(JSON.stringify(resPacketData));
                }break;
            }
        }
    }
}

// 解析主机自动发现应答包
function parseDiscoverHostData(buffer) {
    util.printLog('cc_filter', 'parseDiscoverHostData...');

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter discover host count', count);

    var datas = [];

    var charset = 'utf8';
    try {
        var one_item_len = cc_data.getFieldNameMaxLen() + cc_data.getFieldIpMaxLen();
        for(var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * one_item_len;

            var buffer_name = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_name = util.getDecodeZhBuffer(buffer_name, charset);
            item_name = util.subLeftValidStr(item_name);

            item_offset += cc_data.getFieldNameMaxLen();

            var buffer_ip = buffer.slice(item_offset, item_offset + cc_data.getFieldIpMaxLen());
            var item_ip = util.getDecodeZhBuffer(buffer_ip, charset);
            item_ip = util.subLeftValidStr(item_ip);

            if (item_ip != undefined) {
                if (item_name == undefined || item_name == '') {
                    item_name = item_ip;
                }

                var itemData = {
                    id: (idx + 1),
                    name: item_name,
                    ip: item_ip
                }

                datas.push(itemData);
            }
        }
    }
    catch (err) {
        util.printLog('parse discover host data error', err);
        datas = [];
    }

    util.printLog('cc_filter discover host list', datas);

    return datas;
}

// 解析负载应答包
function parseAsLoadData(buffer) {

    util.printLog('cc_filter', 'parseAsLoadData...');
    //util.printLog('cc_filter_binary_buffer', buffer.toString('binary'));

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 获取数据个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter load count', count);

    var datas = [];

    var charset = 'utf8';
    try {
        for(var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * 28;
            // ip
            var buffer_ip = buffer.slice(item_offset, item_offset + cc_data.getFieldIpMaxLen());
            var item_ip = util.getDecodeZhBuffer(buffer_ip, charset);
            item_ip = util.subLeftValidStr(item_ip);

            item_offset += cc_data.getFieldIpMaxLen();

            // 主机是否在线
            var item_status = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            // 核数
            var item_cores = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            // 用户数
            var item_users = buffer.readUInt32LE(item_offset);

            var itemData = {};
            itemData[json_key.getIpKey()] = item_ip;
            itemData[json_key.getStatusKey()] = item_status;
            itemData[json_key.getCoreKey()] = item_cores;
            itemData[json_key.getUserKey()] = item_users;

            datas[idx] = itemData;
        }

        // 保存到缓存表
        if (count > 0) {
            for(var idx = 0; idx < count; idx++) {
                var itemData = datas[idx];

                util.SetCacheValue(itemData[json_key.getIpKey()], itemData);
            }
        }
    }
    catch (err) {
        util.printLog('parse as load data error', err);
        datas = [];
    }

    util.printLog('cc_filter as load', datas);

    return datas;
}

function parseUserActiveData(buffer) {
    util.printLog('cc_filter', 'parseUserActiveData...');

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 获取数据个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter user active count', count);

    var datas = [];

    var charset = 'utf8';
    try {
        for(var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * (cc_data.getFieldNameMaxLen() + 4);

            // uname
            var buffer_uname = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_uname = util.getDecodeZhBuffer(buffer_uname, charset);
            item_uname = util.subLeftValidStr(item_uname);

            item_offset += cc_data.getFieldNameMaxLen();

            // 主机是否在线
            var item_status = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var itemData = {};
            itemData[json_key.getNameKey()] = item_uname;
            itemData[json_key.getCountKey()] = item_status;

            datas[idx] = itemData;
        }
    }
    catch (err) {
        util.printLog('parse user active data error', err);
        datas = [];
    }

    util.printLog('cc_filter user active', datas);

    return datas;
}

function parseMonUserData(buffer) {
    util.printLog(module_name, 'parseMonUserData...');
    //util.printLog(module_name + ' parseMonUserData buff hex', buffer.toString('hex'));

    // totalSize: 112 bytes
    // user_name: 100 bytes // 用户名称
    // active: 4 bytes // 是否活动
    // app_inst_count: 4 bytes // 应用实例进程数
    // as_count: 4 bytes // 使用主机数

    var datas = [];

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 获取数据个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter mon user count', count);

    var charset = 'utf8';
    try {
        for(var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * (cc_data.getFieldNameMaxLen() + 12);

            var buffer_uname = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_uname = util.getDecodeZhBuffer(buffer_uname, charset);
            item_uname = util.subLeftValidStr(item_uname);

            item_offset += cc_data.getFieldNameMaxLen();
            var item_active = buffer.readUInt32LE(item_offset);

            item_offset += 4;
            var item_app_inst_count = buffer.readUInt32LE(item_offset);

            item_offset += 4;
            var item_as_count = buffer.readUInt32LE(item_offset);

            var itemData = {};

            itemData[json_key.getNameKey()] = item_uname;
            itemData[json_key.getStatusKey()] = item_active;
            itemData[json_key.getAppCountKey()] = item_app_inst_count;
            itemData[json_key.getAsCountKey()] = item_as_count;

            util.printLog(module_name + ' mon user item data', itemData);

            datas[idx] = itemData;
        }
    }
    catch(err) {
        util.printLog('parse mon user data error', err);
        datas = [];
    }

    util.printLog('cc_filter mon user data', datas);

    return datas;
}

function parseMonHostData(buffer) {
    util.printLog('cc_filter', 'parseMonHostData...');

    // totalSize: 36 bytes
    // ip: 16 bytes
    // online: 4 bytes; 1在线，0离线
    // userCount: 4 bytes: 用户数量
    // coreCount: 4 bytes: cpu核数
    // cpuUsage: 4 bytes : cpu使用率，%比整数
    // memUsage: 4 bytes: 内存使用率，%比整数

    var datas = [];

    var data_len = buffer.length;
    var item_len = cc_data.getFieldIpMaxLen() + 20;
    var offset = cc_data.getPacketHeadLen();

    var charset = 'utf8';

    if (data_len >= (offset + item_len)) {

        for(;offset < data_len; offset += item_len) {
            var buff_ip = buffer.slice(offset, offset + cc_data.getFieldIpMaxLen());
            var item_ip = util.getDecodeZhBuffer(buff_ip, charset);
            item_ip = util.subLeftValidStr(item_ip);

            offset += cc_data.getFieldIpMaxLen();

            var item_online = buffer.readUInt32LE(offset);
            offset += 4;

            var item_user_count = buffer.readUInt32LE(offset);
            offset += 4;

            var item_core_count = buffer.readUInt32LE(offset);
            offset += 4;

            var item_cpu_usage = buffer.readUInt32LE(offset);
            offset += 4;

            var item_mem_usage = buffer.readUInt32LE(offset);
            offset += 4;

            var itemData = {};
            itemData[json_key.getStatusKey()] = item_online;
            itemData[json_key.getIpKey()] = item_ip;
            itemData[json_key.getUserKey()] = item_user_count;
            itemData[json_key.getCoreKey()] = item_core_count;
            itemData[json_key.getCpuKey()] = item_cpu_usage;
            itemData[json_key.getMemoryKey()] = item_mem_usage;

            datas.push(itemData);
        }
    }

    util.printLog('cc_filter mon host data', datas);

    return datas;
}

function parseMonAppData(buffer) {
    util.printLog(module_name, 'parseMonAppData...');

    // totalSize: 208 bytes
    // imageName: 100 bytes
    // fileDesc: 100 bytes
    // fileSize: 4 bytes
    // iconName: 100 bytes
    // userCount: 4 bytes;
    // instanceCount: 4 bytes

    util.printLog(module_name + ' app data', buffer.toString('hex'));

    var datas = [];

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 获取数据个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter mon app count', count);

    var charset = 'utf8';
    try {
        var item_max_len = 3 * cc_data.getFieldNameMaxLen() + 12;

        for(var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * (item_max_len);

            var buffer_uname = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_image_name = util.getDecodeZhBuffer(buffer_uname, charset);
            item_image_name = util.subLeftValidStr(item_image_name);

            item_offset += cc_data.getFieldNameMaxLen();

            var buffer_file_desc = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_file_desc = util.getDecodeZhBuffer(buffer_file_desc, charset);
            item_file_desc = util.subLeftValidStr(item_file_desc);

            item_offset += cc_data.getFieldNameMaxLen();

            var item_file_size = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var buffer_icon_name = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_icon_name = util.getDecodeZhBuffer(buffer_icon_name, charset);
            item_icon_name = util.subLeftValidStr(item_icon_name);

            item_offset += cc_data.getFieldNameMaxLen();

            var item_user_count = buffer.readUInt32LE(item_offset);

            item_offset += 4;
            var item_instance_count = buffer.readUInt32LE(item_offset);

            var itemData = {};

            itemData[json_key.getNameKey()] = item_image_name;
            itemData[json_key.getDescKey()] = item_file_desc;
            itemData[json_key.getSizeKey()] = item_file_size;
            itemData[json_key.getIconKey()] = item_icon_name;
            itemData[json_key.getUserCountKey()] = item_user_count;
            itemData[json_key.getInstanceCountKey()] = item_instance_count;

            datas[idx] = itemData;
        }
    }
    catch (err) {
        util.printLog('parse mon app data error', err);
        datas = [];
    }

    util.printLog('cc_filter mon app data', datas);

    return datas;
}

function parseMonAppInstData(buffer) {
    util.printLog('cc_filter', 'parseMonAppInstData...');

    // item data
    // total:
    // processId: 4 bytes
    // fullPath: 520 bytes (2 * MAX_PATH)
    // userName: 100 bytes
    // active: 4 bytes
    // ip: 16 bytes
    // createTime: 20 bytes

    util.printLog(module_name + ' app inst data', buffer.toString('hex'));

    var datas = [];

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 获取数据个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter mon app inst count', count);

    var charset = 'utf8';
    try {
        var item_max_len = cc_data.getFullPathMaxLen() + cc_data.getFieldNameMaxLen() + cc_data.getFieldIpMaxLen() + cc_data.getStringTimeMaxLen() + 8;
        for(var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * (item_max_len);

            var item_process_id = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var buff_full_path = buffer.slice(item_offset, item_offset + cc_data.getFullPathMaxLen());
            var item_full_path = util.getDecodeZhBuffer(buff_full_path, charset);
            item_full_path = util.subLeftValidStr(item_full_path);

            item_offset += cc_data.getFullPathMaxLen();

            var buff_user_name = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_user_name = util.getDecodeZhBuffer(buff_user_name, charset);
            item_user_name = util.subLeftValidStr(item_user_name);

            item_offset += cc_data.getFieldNameMaxLen();

            var item_user_active = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var buff_ip = buffer.slice(item_offset, item_offset + cc_data.getFieldIpMaxLen());
            var item_ip = util.getDecodeZhBuffer(buff_ip, charset);
            item_ip = util.subLeftValidStr(item_ip);

            item_offset += cc_data.getFieldIpMaxLen();

            var buff_create_time = buffer.slice(item_offset, item_offset + cc_data.getStringTimeMaxLen());
            var item_create_time = util.getDecodeZhBuffer(buff_create_time, charset);
            item_create_time = util.subLeftValidStr(item_create_time);

            if (util.IsEmpty(item_process_id)) {
                continue;
            }

            var itemData = {};

            itemData[json_key.getProcessIdKey()] = item_process_id;
            itemData[json_key.getPathKey()] = item_full_path;
            itemData[json_key.getUserNameKey()] = item_user_name;
            itemData[json_key.getActiveKey()] = item_user_active;
            itemData[json_key.getIpKey()] = item_ip;
            itemData[json_key.getCreateTimeKey()] = item_create_time;

            datas.push(itemData);
        }
    }
    catch (err) {
        util.printLog('parse mon app inst data error', err);
        datas = [];
    }

    util.printLog('cc_filter mon app data', datas);

    return datas;
}

function parseMonUserActInstData(buffer) {
    util.printLog('cc_filter', 'parseMonUserActInstData...');

    // total:
    // processId: 4 bytes
    // fullPath: 520 bytes
    // fielDescName: 100 bytes
    // fileSize: 4 bytes
    // iconName: 100 bytes
    // userActive: 4 bytes
    // ip: 16 bytes
    // createTime: 20 bytes (2019-09-09 11:59:27)

    util.printLog(module_name + ' user act inst data', buffer.toString('hex'));

    var datas = [];

    var offset = cc_data.getPacketHeadLen();
    var count = 0;

    // 获取数据个数
    count = buffer.readUInt32LE(offset);
    offset += 4;

    util.printLog('cc_filter mon user act inst count', count);

    var charset = 'utf8';
    try {
        var item_max_len = cc_data.getFullPathMaxLen() + 2 * cc_data.getFieldNameMaxLen() + cc_data.getFieldIpMaxLen() + cc_data.getStringTimeMaxLen() + 12;

        for (var idx = 0; idx < count; idx++) {
            var item_offset = offset + idx * (item_max_len);

            var item_process_id = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var buff_full_path = buffer.slice(item_offset, item_offset + cc_data.getFullPathMaxLen());
            var item_full_path = util.getDecodeZhBuffer(buff_full_path, charset);
            item_full_path = util.subLeftValidStr(item_full_path);

            item_offset += cc_data.getFullPathMaxLen();

            var buff_desc_name = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_desc_name = util.getDecodeZhBuffer(buff_desc_name, charset);
            item_desc_name = util.subLeftValidStr(item_desc_name);

            item_offset += cc_data.getFieldNameMaxLen();

            var item_file_size = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var buffer_icon_name = buffer.slice(item_offset, item_offset + cc_data.getFieldNameMaxLen());
            var item_icon_name = util.getDecodeZhBuffer(buffer_icon_name, charset);
            item_icon_name = util.subLeftValidStr(item_icon_name);

            item_offset += cc_data.getFieldNameMaxLen();

            var item_user_active = buffer.readUInt32LE(item_offset);
            item_offset += 4;

            var buff_ip = buffer.slice(item_offset, item_offset + cc_data.getFieldIpMaxLen());
            var item_ip = util.getDecodeZhBuffer(buff_ip, charset);
            item_ip = util.subLeftValidStr(item_ip);

            item_offset += cc_data.getFieldIpMaxLen();

            var buff_create_time = buffer.slice(item_offset, item_offset + cc_data.getStringTimeMaxLen());
            var item_create_time = util.getDecodeZhBuffer(buff_create_time, charset);
            item_create_time = util.subLeftValidStr(item_create_time);

            if (util.IsEmpty(item_process_id)) {
                continue;
            }

            var itemData = {};

            itemData[json_key.getProcessIdKey()] = item_process_id;
            itemData[json_key.getPathKey()] = item_full_path;
            itemData[json_key.getDescNameKey()] = item_desc_name;
            itemData[json_key.getSizeKey()] = item_file_size;
            itemData[json_key.getIconKey()] = item_icon_name;
            itemData[json_key.getActiveKey()] = item_user_active;
            itemData[json_key.getIpKey()] = item_ip;
            itemData[json_key.getCreateTimeKey()] = item_create_time;

            datas.push(itemData);

        }
    }
    catch(err) {
        util.printLog('parse mon user act inst data error', err);
        datas = [];
    }

    util.printLog('cc_filter mon user act inst data', datas);

    return datas;
}

function parseAppImageData(buffer) {
    util.printLog('cc_filter', 'parseAppImageData...');

    // status: 4 bytes
    // name: 100 bytes
    // size: 4 bytes

    var datas = [];

    var data_len = buffer.length;

    var offset = cc_data.getPacketHeadLen();

    // 获取状态
    var status = buffer.readUInt32LE(offset);
    offset += 4;

    var file_name = '';
    var file_size = 0;

    if (status) {
        var buff_file_name = buffer.slice(offset, offset + cc_data.getFieldNameMaxLen());
        file_name = util.getDecodeZhBuffer(buff_file_name, 'utf8');
        file_name = util.subLeftValidStr(file_name);

        offset += cc_data.getFieldNameMaxLen();

        file_size = buffer.readUInt32LE(offset);
    }

    var itemData = {
        status: status,
        name: file_name,
        size: file_size
    }

    datas.push(itemData);

    util.printLog('cc_filter app image', datas);

    return datas;
}

var cc_fiter = {

    // 完成回调函数
    completed: null,

    onSetCompleted: function(callback) {
        this.completed = callback;
    },

    onRecv: function(res) {
        var that = this;

        that.onParsePacket(res)
    },

    onError: function(err) {
        var that = this;
        util.printLog('cc_filter error', err);
        if (that.completed) {
            that.completed(err, null);
        }
    },

    onParsePacket: function(data) {
        var that = this;

        if (data == null) {
            // 数据为空，代表此轮数据处理结束
            if (that.completed) {
                that.completed(null ,[]);
            }
            return;
        }
        util.printLog('cc filter packet length', data.length);

        var data_len = data.length;
        var pkt_head_len = cc_data.getPacketHeadLen();

        if (data_len < pkt_head_len) {
            util.printLog('cc_filter', 'invalid packet.');
            return false;
        }

        var cmd_len = 0;
        var cmd_ver = 0;
        var cmd_id = 0;
        var format = 0;

        // 获取包头信息
        var offset = 0;
        cmd_len = data.readUInt32LE(offset);

        offset += 4;
        cmd_ver = data.readUInt32LE(offset);

        offset += 4;
        cmd_id = data.readUInt32LE(offset);

        offset += 4;
        format = data.readUInt32LE(offset);

        var msg = 'cmd_len: ' + cmd_len + ' cmd_ver: ' + cmd_ver + ' cmd_id: ' + cmd_id + ' format: ' + format;
        util.printLog('cc filter packet info ', msg);

        var datas = [];
        // data
        offset += 4;
        switch(cmd_id) {
            case cc_data.getActiveTestCmdId(): {
                // 心跳包
                var cc_op = util.GetCCOP();
                if (cc_op != null && cc_op != undefined) {
                    cc_op.activeTestAsk();
                }
                return true;
            }break;

            case cc_data.getDiscoverHostRespCmdId(): {
                // 主机自动发现
                datas = parseDiscoverHostData(data);
            }break;

            case cc_data.getHostLoadRespCmdId(): {
                // 获取主机负载应答包
                datas = parseAsLoadData(data);
            }break;

            case cc_data.getUserActiveRespCmdId(): {
                // 获取活动用户信息应答包
                datas = parseUserActiveData(data);
            }break;

            case cc_data.getMonUserRespCmdId(): {
                // 获取监控用户应答包
                datas = parseMonUserData(data);
            }break;

            case cc_data.getMonHostRespCmdId(): {
                // 获取监控主机信息应答包
                datas = parseMonHostData(data);
            }break;

            case cc_data.getMonAppRespCmdId(): {
                // 获取监控应用信息应答包
                datas = parseMonAppData(data);
            }break;

            case cc_data.getMonAppInstRespCmdId(): {
                // 获取监控应用实例信息应答包
                datas = parseMonAppInstData(data);
            }break;

            case cc_data.getMonUserActInstRespCmdId(): {
                // 获取监控用户活动实例应答包
                datas = parseMonUserActInstData(data);
            }break;

            case cc_data.getAppImageRespCmdId(): {
                datas = parseAppImageData(data);
            }break;

            default: {
                util.printLog('cc filter unknow packet', cmd_id);
                break;
            }
        }

        if (that.completed) {
            that.completed(null ,datas);
        }

        // 数据转发
        var cmdid = 0;
        switch (cmd_id) {

            case cc_data.getMonHostRespCmdId(): {
                // 主机监控：一次请求，返回多条数据，因此需要特殊处理
                cmdid = child_packet.getChildMonHostCmdId();
                sendMapListData(cmdid, datas);
            }break;

        }

        return true;
    }


}

module.exports = cc_fiter;
