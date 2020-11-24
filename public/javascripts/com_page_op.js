/**
 * Created by fushou on 2018/6/29.
 */

function GetIEVersion() {
    var ver_num = 0;

    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7)
            ver_num = 7;
        else if (fIEVersion == 8)
            ver_num = 8;
        else if (fIEVersion == 9)
            ver_num = 9;
        else if (fIEVersion == 10)
            ver_num = 10;
        else
            ver_num = 6;
    }
    else if (isEdge) {
        // edge
        ver_num = 12;
    }
    else if (isIE11) {
        ver_num = 11;
    }
    return ver_num;
}
//获取cookie值
function getCookie(name)
{
    //document.cookie.setPath("/");
    var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    {
        return unescape(arr[2]);
    }
    else
    {
        return null;
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    // var r = window.location.search.substr(1).match(reg);
    var substr = window.location.search.substr(1);
    if (substr == null || substr.length < 1)
        return null;
    var r = substr.match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

function getZhEncode(value) {
    return encodeURI(value);
}

function getZhDecode(value) {
    return decodeURI(decodeURI(value));
}

function getInnerWidth() {
    var iw = 0;
    if (window.innerWidth != undefined) {
        iw = window.innerWidth;
    }
    else {
        //var b = document.body;
        //var d = document.documentElement;
        //iw = Math.min(b.clientWidth, d.clientWidth);
        iw = ((document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth);
    }
    return iw;
}

function getInnerHeight() {
    var ih = 0;
    if (window.innerHeight != undefined) {
        ih = window.innerHeight;
    }
    else {
        //var b = document.body;
        //var d = document.documentElement;
        //ih = Math.min(b.clientHeight, d.clientHeight);
        ih = ((document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight);

    }
    return ih;
}

function getMaxDeskWidth() {
    return getInnerWidth();
}

function getMaxDeskHeight() {
    return getInnerHeight();
}

function getMaxTaskHeight() {
    return 40;
}

function getDeskAppWidth() {
    return 80;
}

function getDeskAppHeight() {
    return 80;
}

function  getTableMinWidth(){
    return 600;
}

function getTableMinHeight() {
    return 450;
}

function  getDeskTableRows(desk_h, app_h) {
    return parseInt(desk_h / app_h - 1);
}

function getDeskTableColumns(desk_w, app_w) {
    return parseInt(desk_w / app_w - 1);
}

function getStyleIntValue(style_value) {
    var val = '';
    var pos = style_value.indexOf('px');
    if (pos > 0) {
        val = style_value.substr(0, pos);
    }
    else {
        val = style_value;
    }
    return val;
}

function OnGetTdId(row_idx, column_idx) {
    var td_id = new Array();
    td_id.push(row_idx);
    td_id.push('_');
    td_id.push(column_idx);
    return td_id.join("");
 }

function OnTdIsEmpty(td_id) {
    var itemEle = document.getElementById(td_id);
    if (itemEle == undefined)
        return undefined;
    var item_id = itemEle.getAttribute('item_id');
    if (item_id == undefined || item_id == '')
    {
        return true;
    }
    return false;
}

function OnGetEmptyTdId(rows, columns) {
    var td_id = '';
    for(var j = 0; j < columns; j++) {
        for(var i = 0; i < rows; i++) {
            var item_td_id = OnGetTdId(i, j);
            var itemEle = document.getElementById(item_td_id);
            if (itemEle == undefined)
                continue;
            var item_id = itemEle.getAttribute('item_id');
            if (item_id == undefined || item_id == '') {
                td_id = item_td_id;
                return td_id;
            }
        }
    }
    return '';
}

function OnSetTableTdAttr(td, row_idx, column_idx, app_w, app_h, app_url) {
    var td_id = OnGetTdId(row_idx, column_idx);
    td.setAttribute('id', td_id); // ID 属性
    //td.setAttribute('class', 'drag-td');
    td.setAttribute('app_url',app_url); // 自定义属性

    td.align = "center";
    // 单元格风格
    td.style.left = (column_idx * app_w) + 'px';
    td.style.top = (row_idx * app_h) + 'px';
    td.style.width = app_w + 'px';
    td.style.height = app_h + 'px';
    td.style.border = "0px";
    //td.innerHTML = i + '_' + j; // 单元格内容
}

function OnTableCreate(id, rows, columns, w, h, app_w, app_h) {
    // 新建表格
    //var tb = document.createElement("table");
    //tb.id = id;

    // 查找表格
    var tb = document.getElementById(id);
    if (tb == undefined) {
        return tb;
    }

    // 设置表格风格
    tb.style.position = "absolute";
    tb.style.left = "0px";
    tb.style.top = "0px";
    tb.style.width = w + 'px';
    tb.style.height = h + 'px';
    tb.style.emptyCells = "hide"; // 空单元格就隐藏

    var tr,td;
    for(var i = 0; i < rows; i++) {
        tr = tb.insertRow(tb.rows.length); // 将新行添加到表格末尾
        for(var j = 0; j < columns; j++) {
            td = tr.insertCell(tr.cells.length); // 在最后面添加单元格

            // 设置单表格元格属性
            OnSetTableTdAttr(td, i, j, app_w, app_h, '');
        }
    }

    return tb;
}

function OnSetImageTableTdAttr(td, row_idx, column_idx, td_w, td_h) {
    var td_id = OnGetTdId(row_idx, column_idx);
    td.setAttribute('id', td_id); // ID 属性

    td.align = "center";
    // 单元格风格
    td.style.left = (column_idx * td_w) + 'px';
    td.style.top = (row_idx * td_h) + 'px';
    td.style.width = td_w + 'px';
    td.style.height = td_h + 'px';
    td.style.border = "0px";
    //td.innerHTML = i + '_' + j; // 单元格内容
}

function  OnImageTableCreate(id, rows, columns, w, h, img_w, img_h) {
    // 查找表格
    var tb = document.getElementById(id);
    if (tb == undefined) {
        return tb;
    }

    if (tb.rows.length > 0) {
        for(var idx = tb.rows.length - 1; idx >= 0; idx--) {
            tb.deleteRow(idx);
        }
    }

    // 设置表格风格
    tb.style.width = w + 'px';
    tb.style.height = h + 'px';
    tb.style.emptyCells = "hide"; // 空单元格就隐藏
    tb.style.overflow = 'auto';

    var tr,td;
    for(var i = 0; i < rows; i++) {
        tr = tb.insertRow(tb.rows.length); // 将新行添加到表格末尾
        for(var j = 0; j < columns; j++) {
            td = tr.insertCell(tr.cells.length); // 在最后面添加单元格

            // 设置单表格元格属性
            OnSetImageTableTdAttr(td, i, j, img_w, img_h);
        }
    }

    return tb;
}

function OnTableModify(table_id, dw, dh) {

    var tab = document.getElementById(table_id);
    if (tab == undefined) {
        return;
    }

    // 取得旧表格行数和列数
    var columns = 0;
    var rows = tab.rows.length;
    if (rows > 0) {
        columns = tab.rows.item(0).cells.length;
    }

    if (rows < 1 || columns < 1) {
        // 表格无效
        return;
    }

    var app_w = getDeskAppWidth();
    var app_h = getDeskAppHeight();

    // 取得新表格行数和列数
    var tb_rows = getDeskTableRows(dh, app_h); // parseInt(dh / app_h - 1); //
    var tb_columns = getDeskTableColumns(dw, app_w); // parseInt(dw / app_w - 1);

    var min_rows = (rows < tb_rows ? rows : tb_rows);
    var min_columns = (columns < tb_columns ? columns : tb_columns);

    var save = false;
    // 列
    if (columns > tb_columns) {
        // 移动数据，将被覆盖的项移动到最开始的空位置
        for(var i = 0; i < rows; i++) {
            for(var j = tb_columns; j < columns; j++) {
                var from_td_id = OnGetTdId(i, j);
                if (!OnTdIsEmpty(from_td_id)) {
                    var to_td_id = OnGetEmptyTdId(min_rows, min_columns);
                    if (to_td_id != undefined && to_td_id.length > 0) {
                        moveDeskAppItem(from_td_id, to_td_id, save);
                    }
                }
            }
        }
        // 删除多余列
        for(var j = columns - 1; j >= tb_columns; j--) {
            for(var i = rows - 1; i >= 0; i--) {
                tab.rows[i].deleteCell(j);
            }
        }
    }
    else if (tb_columns > columns) {
        // 添加新增列
        for(var i = 0; i < rows; i++) {
            var tr = tab.rows[i];
            for(var j = columns; j < tb_columns; j++) {
                var td = tr.insertCell(j);
                // 设置单表格元格属性
                OnSetTableTdAttr(td, i, j, app_w, app_h, '');
            }
        }
    }

    // 行
    if (rows > tb_rows) {
        // 移动数据，将被覆盖的项移动到最开始的空位置
        for(var i = tb_rows; i < rows; i++) {
            for(var j = 0; j < min_columns; j++) {
                var from_td_id = OnGetTdId(i, j);
                if (!OnTdIsEmpty(from_td_id)) {
                    var to_td_id = OnGetEmptyTdId(min_rows, min_columns);
                    if (to_td_id != undefined && to_td_id.length > 0) {
                        moveDeskAppItem(from_td_id, to_td_id, save);
                    }
                }
            }
        }
        // 删除多余行
        for(var i = rows - 1; i >= tb_rows; i--) {
            tab.deleteRow(i);
        }
    }
    else if (tb_rows > rows) {
        // 添加新增行
        for(var i = rows; i < tb_rows; i++) {
            var tr = tab.insertRow(i);
            for(var j = 0; j < tb_columns; j++) {
                var td = tr.insertCell(tr.cells.length);
                // 设置单表格元格属性
                OnSetTableTdAttr(td, i, j, app_w, app_h, '');
            }
        }
    }

    // 调整表格窗口尺寸
    tab.style.width = dw + 'px';
    tab.style.height = dh + 'px';
}

function getRowIdxFromId(id) {
    var index = id.substr(0, id.indexOf('_'));
    return index;
}

function getColumnIdxFromId(id) {
    var index = id.substr(id.lastIndexOf('_') + 1);
    return index;
}

function checkPtInRect(pt_x, pt_y, rc_left, rc_top, rc_right, rc_bottom) {
    if ((pt_x >= rc_left) && (pt_x <= rc_right) &&
        (pt_y >= rc_top) && (pt_y <= rc_bottom)) {
        return true;
    }
    return false;
}

function getTdId(pt_x, pt_y) {
    var id = '';

    var desk_w = getMaxDeskWidth();
    var desk_h = getMaxDeskHeight();
    var desk_app_w = getDeskAppWidth();
    var desk_app_h = getDeskAppHeight();

    var tb_tar = document.getElementById('app');
    if (tb_tar == null) {
        return '';
    }

    var tb_rows = tb_tar.rows.length;
    var tb_columns = 0;
    if (tb_rows > 0) {
        tb_columns = tb_tar.rows[0].cells.length;
    }

    var row_idx = -1;
    var column_idx = -1;

    var rc_left = -1;
    var rc_top = -1;
    var rc_right = -1;
    var rc_bottom = -1;

    for(row_idx = 0; row_idx < tb_rows; row_idx++) {
        for(column_idx = 0; column_idx < tb_columns; column_idx++) {
            var td_id = OnGetTdId(row_idx, column_idx);
            var tdObj = document.getElementById(td_id);
            if (tdObj == null)
                continue;
            var tdRect = tdObj.getBoundingClientRect();
            rc_left = tdRect.left;
            rc_top = tdRect.top;
            rc_right = tdRect.right;
            rc_bottom = tdRect.bottom;
            if (checkPtInRect(pt_x, pt_y, rc_left, rc_top, rc_right, rc_bottom)) {
                id = td_id;
                return id;
            }
        }
    }

    return id;
}

function moveDeskAppItem(from_td_id, to_td_id, save) {
    //
    /*//from_row_idx = getRowIdxFromId(from_td_id);
    //from_column_idx = getColumnIdxFromId(from_td_id);
    to_row_idx = getRowIdxFromId(to_td_id);
    to_column_idx = getColumnIdxFromId(to_td_id);

    // 获取源信息
    var srd_td = document.getElementById(from_td_id);
    var app_url = srd_td.getAttribute('app_url');
    var item_id = srd_td.getAttribute('item_id');
    var inner_html = srd_td.innerHTML;

    // 获取目标信息
    var dst_td = document.getElementById(to_td_id);
    var dst_app_url = dst_td.getAttribute('app_url');
    if (dst_app_url != undefined && dst_app_url.length > 0) {
        alert('不允许覆盖已经存在的项！');
        return;
    }

    // 更新目标
    dst_td.setAttribute('item_id', item_id);
    dst_td.setAttribute('app_url', app_url);
    dst_td.innerHTML = inner_html;

    // 清除源信息
    srd_td.removeAttribute('item_id');
    srd_td.removeAttribute('app_url');
    srd_td.innerHTML = '';

    if (!save) {
        // 不保存修改
        return;
    }

    // 提交更新后台记录
    var jsonParam = {
        'item_id': item_id,
        'x_left': to_row_idx,
        'y_top': to_column_idx
    };

    // 可能是json的问题，ie6， 7 不支持json和其他所带的方法可以试试这个json2.js
    var rootPath = window.location.protocol + '//' + window.location.host ;
    var postUrl = rootPath + '/desk/app_position';
    $.ajax({
        url: postUrl,
        type:'POST',
        async: false,
        cache:false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsonParam),
        success: function(data) {
        },
        error: function(err){
            alert(JSON.stringify(err));
        }
    });*/
}

function onAppPolicyQuery(reqUrl, user_name, postData) {
    httpPostRequest(reqUrl, user_name, postData, function(res){

        var data = res;

        var status = data['status'];
        if (status == 1) {
            var command = data['data'];

            // 检测插件，如果成功则执行
            onCheckPlugin(command, null, null);
        }
        else {
            var msg = data['msg'];
            onErrorHandle(status, msg);
        }
    });
}

function onCloudAppRequest(type_name, user_id, user_name) {

    var reqUrl = getBaseUrl() + '/manage/app_policy_query';
    var postData = {};

    postData['type'] = type_name;
    postData['id'] = 0;
    postData['user_id'] = user_id;
    postData['user_name'] = user_name;
    postData['app_id'] = 0;
    postData['time'] = new Date().getTime();

    httpPostRequest(reqUrl, user_name, postData, function(res){

        var status = res['status'];
        if (status == 1) {
            var command = res['data'];

            // 检测插件，如果成功则执行
            onCheckPlugin(command, null, null);
        }
        else {
            var msg = res['msg'];
            onErrorHandle(status, msg);
        }
    });
}

// onInitClient : 初始化普通用户客户端
function onInitClient() {
    var id = getQueryString("id");
    var name = getZhDecode(getQueryString("name"));

    try {
        // 获取本地缓存记录
        var userInfo = getUserInfo(name);
        if (userInfo != undefined && userInfo != null) {
            var userInfoObj = JSON.parse(userInfo);
            if (userInfoObj) {
                var is_inited = userInfoObj['is_inited'];
                if (is_inited != 1) {
                    // 初始化云
                    onInitCloud(id, name, userInfoObj);
                }
            }
        }
    }catch(err) {

    }
}

// 云初始化
function onInitCloud(user_id, user_name, user_data) {
    // onCloudAppRequest('cloud_init', id, name);
    var reqUrl = getBaseUrl() + '/manage/app_policy_query';
    var postData = {};

    postData['type'] = 'cloud_init';
    postData['id'] = 0;
    postData['user_id'] = user_id;
    postData['user_name'] = user_name;
    postData['app_id'] = 0;
    postData['time'] = new Date().getTime();

    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status == 1) {
            var command = res['data'];

            // 检测插件
            onCheckPlugin(command, user_name, user_data);
        }
        else {
            var msg = res['msg'];
            onErrorHandle(status, msg);
        }
    });
}

// 检测插件是否安装
function onCheckPlugin(href, user_name, user_data) {

    function onCheckFail() {
        // 插件检测失败，即没有检测到插件
        //alert('插件检测失败，请重新安装插件');
        // 登录的时候检测插件失败，则发出警告提醒，其它则不提醒
        if (user_data) {
            var is_warn = user_data['is_fail_warn'];
            if (is_warn == 1) {
                $("#plugin_warn").modal();
            }
        }
    };

    function onCheckSuccess() {
        // 插件检测成功
        if (user_name != undefined && user_name != null && user_name != '' &&
            user_data != null && user_data != undefined) {

            // 更新缓存
            var userInfoObj = user_data;
            userInfoObj['is_inited'] = 1;
            setUserInfo(user_name, JSON.stringify(userInfoObj));
        }

        // 执行命令(检测的时候已经执行过了，所以不需要再重复执行)
        //if (href != undefined && href != null) {
        //    window.location.href = href;
        //}
    };

    function onCheckUnsupported() {
        // 插件检测失败，无法检测插件
        alert('无法检测是否已经安装了插件');
    };

    // 检测插件是否已经安装
    if (href != undefined && href != null && href != '') {
        window.protocolCheck(href, onCheckFail, onCheckSuccess, onCheckUnsupported);
    }
};

// onPluginWarnStatusClick ： 不提醒插件警告处理函数
function onPluginWarnStatusClick(elem) {
    var checked = elem.checked;
    var is_status = (checked == 1 ? 0 : 1);

    // 获取本地缓存记录
    var name = getZhDecode(getQueryString("name"));
    var userInfo = getUserInfo(name);
    if (userInfo != undefined && userInfo != null) {
        var userInfoObj = JSON.parse(userInfo);
        if (userInfoObj) {
            var is_fail_warn = userInfoObj['is_fail_warn'];
            if (is_status != is_fail_warn) {
                userInfoObj['is_fail_warn'] = is_status;
                setUserInfo(name, JSON.stringify(userInfoObj));
            }
        }
    }
}