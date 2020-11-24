/**
 * Created by fushou on 2019/12/4.
 */
function onIsEmpty(obj) {
    if (obj == undefined || obj == null || obj == '' || obj == {}) {
        return true;
    }
    return false;
}

// onSimpleDeepCopy : 简单数据对象深拷贝
function onSimpleDeepCopy(obj) {
    var retObj = null;
    try {
        retObj = JSON.parse(JSON.stringify(obj));
    }
    catch(err) {
        retObj = null;
    }
    return retObj;
}

function onGetFileName(full_name) {
    var name = '';
    var pos = full_name.lastIndexOf('\\');
    if (pos > 0) {
        name = full_name.substr(pos + 1);
    }
    return name;
}

function onGetDateFromEventTm(event_tm) {
    if (event_tm.length >= 10) {
        return event_tm.substr(0, 10);
    }
    return event_tm;
}

function onGetNumberTypeName() {
    return 'number';
}

function onSetItemValue(info, key, value) {
    info[key] = value;
}

function onAppendItemValue(info, key, value, value_type) {
    if (info[key] == undefined) {
        info[key] = value;
    }
    else {
        if (value_type == onGetNumberTypeName()) {
            info[key] += value;
        }
        else {
            info[key] = value;
        }
    }
}

function onGetItemValue(info, key, default_value) {
    if (onIsEmpty(info[key])) {
        return default_value;
    }
    return info[key];
}

// onAppendArrayValue : 往数据中添加一个数据，支持数据深拷贝
function onAppendArrayValue(obj_array, value, deep_copy) {
    if (obj_array == undefined || obj_array == null) {
        return;
    }

    if (deep_copy) {
        var new_value = onSimpleDeepCopy(value);
        if (new_value) {
            obj_array.push(new_value);
        }
    }
    else if (value) {
        obj_array.push(value);
    }
}

function onInitAppInfo(info, file_desc, file_name, file_size) {
    info['file_desc'] = file_desc;
    info['file_name'] = file_name;
    info['file_size'] = file_size;
}

// onIsSameApp : 判断是否是同一个应用
// 判断一个应用需要同时满足，描述，镜像名称和文件大小相同
function onIsSameApp(info, file_desc, file_name, file_size) {

    var item_file_desc = info['file_desc'];
    var item_file_name = info['file_name'];
    var item_file_size = info['file_size'];

    if (item_file_desc == file_desc && item_file_name == file_name && item_file_size === file_size) {
        return true;
    }
    return false;
}

// onIsExistApp : 判断APP是否在数组列表中
function onIsExistApp(app_list, file_desc, file_name, file_size) {
    var idx = 0;
    for(idx = 0; idx < app_list.length; idx++) {
        var itemData = app_list[idx];

        //var item_file_desc = itemData['file_desc'];
        //var item_file_name = itemData['file_name'];
        //var item_file_size = itemData['file_size'];

        if (onIsSameApp(itemData, file_desc, file_name, file_size)) {
            return true;
        }
    }
    return false;
}

function onFindAppInfo(app_list, file_desc, file_name, file_size) {
    var index = -1;
    if (app_list && app_list.length > 0) {
        for(var idx = 0; idx < app_list.length; idx++) {
            var itemData = app_list[idx];
            if (onIsSameApp(itemData, file_desc, file_name, file_size)) {
                return idx;
            }
        }
    }
    return -1;
}

function onIsSameItem(info, item_key, test_item_value) {
    if (info[item_key] == test_item_value) {
        return true;
    }
    return false;
}

function onFindItemInfo(data_list, item_key, test_item_value) {
    if (data_list && data_list.length > 0) {
        for(var idx = 0; idx < data_list.length; idx++) {
            var itemData = data_list[idx];
            if (onIsSameItem(itemData, item_key, test_item_value)) {
                return idx;
            }
        }
    }
    return -1;
}

// onGetUserAppData : 获取用户应用信息，返回用户打开的应用个数，用户打开的应用实例数
function onGetUserAppData(user_name, app_datas) {

    var total_app_count = 0; // 应用个数
    var total_inst_count = 0; // 应用实例个数

    var temp_app_list = [];

    var idx = 0;
    for(idx = 0; idx < app_datas.length; idx++) {
        var itemData = app_datas[idx];

        var item_user_name = itemData['user_name'];

        if (user_name != item_user_name) {
            continue;
        }

        var item_event_id = itemData['event_id'];
        var item_app_desc = itemData['app_desc'];
        var item_app_path = itemData['app_path'];
        var item_app_file_name = onGetFileName(item_app_path);
        var item_app_size = itemData['app_size'];

        total_inst_count += 1;

        if (!onIsExistApp(temp_app_list, item_app_desc, item_app_file_name, item_app_size)) {
            total_app_count += 1;

            var app_info = {};
            onInitAppInfo(app_info, item_app_desc, item_app_file_name, item_app_size);

            temp_app_list.push(app_info);
        }
    }

    var ret_data = {};
    ret_data['app_count'] = total_app_count;
    ret_data['app_inst_count'] = total_inst_count;
    return ret_data;
}

// onGetListFieldValues : 获取列表中指定列的值，过滤掉重复项
function onGetListFieldValues(list, field) {
    var ret_datas = [];

    if (list == undefined || list == null || list.length < 1 || field == undefined || field == null || field == '') {
        return ret_datas;
    }

    var idx = 0;
    for(idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        var item_value = itemData[field];

        if (!ret_datas.includes(item_value)) {
            ret_datas.push(item_value);
        }
    }

    return ret_datas;
}

// onGetAsAppData : 获取主机上的应用信息数据
function onGetAsAppData(ip_addr, app_datas) {
    var temp_user_count = 0;
    var temp_app_count = 0;
    var temp_app_inst_count = 0;

    var temp_user_list = [];
    var temp_app_list = [];

    var idx = 0;
    for(idx = 0; idx < app_datas.length; idx++) {
        var itemData = app_datas[idx];

        var item_ip = itemData['source'];

        if (ip_addr != item_ip) {
            continue;
        }

        var item_desc = itemData['app_desc'];
        var item_full_path = itemData['app_path'];
        var item_file_name = onGetFileName(item_full_path);
        var item_size = itemData['app_size'];
        var item_user_name = itemData['user_name'];

        // 统计用户信息
        if (!temp_user_list.includes(item_user_name)) {
            temp_user_list.push(item_user_name);
        }

        // 统计应用信息
        if (!onIsExistApp(temp_app_list, item_desc, item_file_name, item_size)) {
            var app_info = {};
            onInitAppInfo(app_info, item_desc, item_file_name, item_size);
            temp_app_list.push(app_info);

            temp_app_count += 1;
        }

        // 统计应用实例数
        temp_app_inst_count += 1;
    }

    temp_user_count = temp_user_list.length;

    var ret_data = {};
    ret_data['ip_addr'] = ip_addr;
    ret_data['user_count'] = temp_user_count;
    ret_data['app_count'] = temp_app_count;
    ret_data['app_inst_count'] = temp_app_inst_count;

    return ret_data;
}

// onAnalysisAppBaseData : 分析应用基础数据
exports.onAnalysisAppBaseData = function(begin_tm, end_tm, datas) {
    var ret_data = [];

    if (datas == undefined || datas == null || datas.length < 1) {
        return ret_data;
    }

    var idx = 0, idy = 0;
    // 第一步，先把应用信息列表找出来
    for(idx = 0; idx < datas.length; idx++) {
        var itemData = datas[idx];

        var item_event_id = itemData['event_id'];
        var item_event_tm = itemData['event_tm'];

        var item_event_begin_tm = onGetDateFromEventTm(item_event_tm) + ' 00:00:00';
        var item_event_end_tm = onGetDateFromEventTm(item_event_tm) + ' 23:59:59';

        var item_ip = itemData['source'];
        var item_desc = itemData['app_desc'];
        var item_full_path = itemData['app_path'];
        var item_file_name = onGetFileName(item_full_path);
        var item_size = itemData['app_size'];
        var item_user_name = itemData['user_name'];

        var index = onFindAppInfo(ret_data, item_desc, item_file_name, item_size);
        if (index == -1) {
            var one_info = {};

            // 初始化应用信息
            onInitAppInfo(one_info, item_desc, item_file_name, item_size);
            onSetItemValue(one_info, 'app_full_name', item_full_path);
            onSetItemValue(one_info, 'file_name', item_file_name);
            onSetItemValue(one_info, 'event_tm', item_event_tm);
            onSetItemValue(one_info, 'begin_tm', item_event_begin_tm);
            onSetItemValue(one_info, 'end_tm', item_event_end_tm);
            // 初始化主机信息
            onSetItemValue(one_info, 'host_count', 0);
            // 用户信息
            onSetItemValue(one_info, 'user_count', 0);
            // 应用实例信息
            onSetItemValue(one_info, 'app_inst_count', 0);

            ret_data.push(one_info);
        }
    }

    // 第二步统计数据
    for(idx = 0; idx < ret_data.length; idx++) {
        var dstItemData = ret_data[idx];

        var temp_host_ip = [];
        var temp_users = [];
        var temp_app_inst_count = 0;

        idy = 0;
        for(idy = 0; idy < datas.length; idy++) {
            var srcItemData = datas[idy];

            var src_item_desc = srcItemData['app_desc'];
            var src_item_full_path = srcItemData['app_path'];
            var src_item_file_name = onGetFileName(src_item_full_path);
            var src_item_size = srcItemData['app_size'];

            if (onIsSameApp(dstItemData, src_item_desc, src_item_file_name, src_item_size)) {

                var src_item_ip = itemData['source'];
                var src_item_user_name = itemData['user_name'];

                // 更新数据
                if (!temp_host_ip.includes(src_item_ip)) {
                    temp_host_ip.push(src_item_ip);
                }

                if (!temp_users.includes(src_item_user_name)) {
                    temp_users.push(src_item_user_name);
                }

                temp_app_inst_count += 1;
            }
        }

        // 更新主机信息
        onSetItemValue(dstItemData, 'host_count', temp_host_ip.length);
        temp_host_ip = [];

        // 更新用户信息
        onSetItemValue(dstItemData, 'user_count', temp_users.length);
        temp_users = [];

        // 应用实例信息
        onSetItemValue(dstItemData, 'app_inst_count', temp_app_inst_count);

        // 更新回去
        ret_data[idx] = dstItemData;
    }

    return ret_data;
}

// onAnalysisUserBaseData : 分析用户基础数据
exports.onAnalysisUserBaseData = function(begin_tm, end_tm, datas) {
    var ret_data = [];

    if (datas == undefined || datas == null || datas.length < 1) {
        return ret_data;
    }

    var idx = 0, idy = 0;
    // 第一步，统计出用户列表
    for(idx = 0; idx < datas.length; idx++) {
        var itemData = datas[idx];

        var item_event_id = itemData['event_id'];

        if (item_event_id != 10001) {
            // 只统计登录事件
            continue;
        }

        var item_user_name = itemData['user_name'];

        var index = onFindItemInfo(ret_data, 'user_name', item_user_name);
        if (index == -1) {
            var one_info = {};

            var item_event_tm = itemData['event_tm'];
            var item_event_begin_tm = onGetDateFromEventTm(item_event_tm) + ' 00:00:00';
            var item_event_end_tm = onGetDateFromEventTm(item_event_tm) + ' 23:59:59';

            onSetItemValue(one_info, 'user_name', item_user_name);
            onSetItemValue(one_info, 'begin_tm', item_event_begin_tm);
            onSetItemValue(one_info, 'end_tm', item_event_end_tm);
            onSetItemValue(one_info, 'login_count', 0);
            onSetItemValue(one_info, 'app_count', 0);
            onSetItemValue(one_info, 'app_inst_count', 0);

            ret_data.push(one_info);
        }
    }

    // 第二步，统计数据
    idx = 0;
    for(idx = 0; idx < ret_data.length; idx++) {
        var dstItemData = ret_data[idx];

        var dst_item_user_name = dstItemData['user_name'];

        var temp_login_count = 0;

        idy = 0;
        for(idy = 0; idy < datas.length; idy++) {
            var srcItemData = datas[idy];

            var src_item_event_id = srcItemData['event_id'];

            if (src_item_event_id != 10001) {
                // 只统计登录事件
                continue;
            }

            var src_item_user_name = srcItemData['user_name'];

            if (onIsSameItem(dstItemData, 'user_name', src_item_user_name)) {
                temp_login_count += 1;
            }
        }

        // 更新数据
        onSetItemValue(dstItemData, 'login_count', temp_login_count);

        ret_data[idx] = dstItemData;
    }

    return ret_data;
}

// onAnalysisUserAppData : 分析用户应用相关数据
exports.onAnalysisUserAppData = function(base_datas, app_datas) {
    if (base_datas == null || base_datas == undefined || base_datas.length < 1 ||
        app_datas == null || app_datas == undefined || app_datas.length < 1) {
        return;
    }

    var idx = 0;
    for(idx = 0; idx < base_datas.length; idx++) {
        var itemData = base_datas[idx];

        var item_user_name = itemData['user_name'];

        var app_info = onGetUserAppData(item_user_name, app_datas);

        // 合并数据
        itemData = Object.assign(itemData, app_info);

        base_datas[idx] = itemData;
    }
}

// onAnalysisAsBaseData : 解析主机基本信息
// 因为主机本身的日志信息可能为空，因此需要联合解析
exports.onAnalysisAsBaseData = function(beging_tm, end_tm, as_datas) {
    var ret_data = [];

    var idx = 0, idy = 0;

    // 第一步，查找主机列表
    for(idx = 0; idx < as_datas.length; idx++) {
        var itemData = as_datas[idx];

        var item_ip_addr = itemData['source'];

        var index = onFindItemInfo(ret_data, 'ip_addr', item_ip_addr);
        if (index == -1) {
            var item_event_id = itemData['event_id'];
            var item_event_tm = itemData['event_tm'];
            var item_event_begin_tm = onGetDateFromEventTm(item_event_tm) + ' 00:00:00';
            var item_event_end_tm = onGetDateFromEventTm(item_event_tm) + ' 23:59:59';

            var one_info = {}

            onSetItemValue(one_info, 'ip_addr', item_ip_addr);
            onSetItemValue(one_info, 'begin_tm', item_event_begin_tm);
            onSetItemValue(one_info, 'end_tm', item_event_end_tm);
            onSetItemValue(one_info, 'online_count', 0);
            onSetItemValue(one_info, 'offline_count', 0);

            ret_data.push(one_info);
        }
    }

    // 第二步，统计数据
    for(idx = 0; idx < ret_data.length; idx++) {
        var dstItemData = ret_data[idx];

        //var dst_item_ip_addr = dstItemData['ip_addr'];

        var temp_online_count = 0;
        var temp_offline_count = 0;

        for(idy = 0; idy < as_datas.length; idy++) {
            var srcItemData = as_datas[idy];

            var src_item_ip_addr = srcItemData['source'];

            if (onIsSameItem(dstItemData, 'ip_addr', src_item_ip_addr)) {
                var item_event_id = itemData['event_id'];
                if (item_event_id == 20001) {
                    // 上线
                    temp_online_count += 1;
                }
                else if (item_event_id == 20002) {
                    // 离线
                    temp_offline_count += 1;
                }
            }

        }

        // 更新数据

        onSetItemValue(dstItemData, 'online_count', temp_online_count);
        onSetItemValue(dstItemData, 'offline_count', temp_offline_count);

        ret_data[idx] = dstItemData;
    }

    return ret_data;
}

// onAnalysisAsAppData : 分析主机应用相关数据
exports.onAnalysisAsAppData = function(base_datas, app_datas) {
    if (base_datas == null || base_datas == undefined || base_datas.length < 1 ||
        app_datas == null || app_datas == undefined || app_datas.length < 1) {
        return;
    }

    // 获取所有应用所在主机的IP地址
    var as_ip_list = onGetListFieldValues(app_datas, 'source');

    if (as_ip_list == null || as_ip_list.length < 1) {
        return;
    }

    var def_online_count = 0;
    var def_offline_count = 0;

    var one_info = {};

    var idx = 0;
    for(idx = 0; idx < as_ip_list.length; idx++) {
        var item_ip_addr = as_ip_list[idx];

        var app_info = onGetAsAppData(item_ip_addr, app_datas);

        // 更新数据
        var base_item_info = null;
        var idy = 0;
        for(idy = 0; idy < base_datas.length; idy++) {
            var itemData = base_datas[idy];
            var item_ip = itemData['ip_addr'];
            if (item_ip_addr == item_ip) {
                base_item_info = itemData;
                break;
            }
        }

        if (base_item_info) {
            // 更新
            base_item_info = Object.assign(base_item_info, app_info);
            base_datas[idy] = base_item_info;
        }
        else {
            // 追加
            app_info['online_count'] = def_online_count;
            app_info['offline_count'] = def_offline_count;
            base_datas.push(app_info);
        }
    }
}
