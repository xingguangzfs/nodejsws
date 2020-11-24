/**
 * Created by fushou on 2019/1/22.
 */

function onCheckInputItemConfirm(itemId) {
    var text = $('#' + itemId).val();
    if (text == undefined || text == null || text.length < 1) {
        return false;
    }
    return true;
}

function getBaseUrl() {
    var basePath = window.location.protocol + '//' + window.location.host ;
    return basePath;
}

function getZhEncode(value) {
    return encodeURI(encodeURI(value));
}

function disabledDeleteUser(user_name) {
    return (user_name == 'admin' ? true : false);
}

function onJSReplaceHtml(ctrlid, innerHtml) {
    document.getElementById(ctrlid).innerHTML = innerHtml;
}

function getDefaultUserImage() {
    var item_img = getBaseUrl() + '/images/user.png';
    return item_img;
}

function getDefaultHostImage(status) {
    var item_img = getBaseUrl();
    if (status == 0) {
        item_img += '/images/server_disable.png';
    }
    else {
        item_img += '/images/server.png';
    }
    return item_img;
}

function onGetStatusText(status) {
    if (status == 1) {
        return '启用';
    }
    return '禁用';
}

function onGetStatusValue(status_text) {
    if (status_text == '启用') {
        return 1;
    }
    return 0;
}

function onGetPrivatePageStartIndex() {
    var index = 0;
    try {
        var value = $("#private_page_start_index").val();
        index = parseInt(value);
    }
    catch(err) {

    }
    return index;
}

function onSetPrivatePageStartIndex(val) {
    $("#private_page_start_index").attr('value', val);
}

function onGetPrivatePageIndex() {
    var index = 0;
    try {
        var value = $("#private_page_index").val();
        index = parseInt(value);
    }
    catch(err) {

    }
    return index;
}

function onSetPrivatePageIndex(val) {
    $("#private_page_index").attr('value', val);
}

function onGetPrivatePageSize() {
    var index = 0;
    try {
        var value = $("#private_page_size").val();
        index = parseInt(value);
    }
    catch(err) {

    }
    return index;
}

function onSetPrivatePageSize(val) {
    $("#private_page_size").attr('value', val);
}

function onGetPrivatePageCount() {
    var index = 0;
    try {
        var value = $("#private_page_count").val();
        index = parseInt(value);
    }
    catch(err) {

    }
    return index;
}

function onSetPrivatePageCount(val) {
    $("#private_page_count").attr('value', val);
}

function onGetPrivatePageBtns() {
    var index = 0;
    try {
        var value = $("#private_page_btns").val();
        index = parseInt(value);
    }
    catch(err) {

    }
    return index;
}

function onSetPrivatePageBtns(val) {
    $("#private_page_btns").attr('value', val);
}

function onStringUserData(list) {
    var str = '';
    for(var idx = 0; idx < list.length; idx++) {
        if (idx > 0) {
            str += ';'; // 英文分号
        }
        str += list[idx];
    }
    return str;
}

function onParseUserData(user_data) {
    var arr = [];
    try {
        var temp_arr = user_data.split(';');
        arr = temp_arr;
    }
    catch (err) {

    }
    return arr;
}

function onSetSelectItem(select_id, selected_text) {
    // 选中指定项
    if (selected_text.length > 0) {
        $("#" + select_id).find("option:contains('" + selected_text + "')").attr("selected", true);
    }
}

function onCheckWindowPswd(pswd) {
    /*
     var strMsg = "密码复杂度不符合Windows服务器版本对强度的要求，规则如下：";
     strMsg += "\n规则一：字符数不少于8位";
     strMsg += "\n规则二：以大写字母开头";
     strMsg += "\n规则三：密码可包含大，小写字符，数字以及特殊字符";
     strMsg += "\n规则四：密码可包括的特殊字符有 @ # $ % & 其中至少需要包含一个特殊字符且不能位于开头和结尾位置";
     */

    // 规则一
    if (pswd == null || pswd.length < 8) {
        return false;
    }

    // 规则二
    var ch = pswd.substr(0, 1);
    if (ch >= 'A' && ch <= 'Z') {

    }
    else {
        return false;
    }

    // 规则三
    var have_low_char = false;
    for(var idx = 1; idx < pswd.length; idx++) {
        ch = pswd.substr(idx, 1);
        if (ch >= 'a' && ch <= 'z') {
            have_low_char = true;
            break;
        }
    }

    if (!have_low_char) {
        return false;
    }

    // 规则四
    var is_ok = false;
    for(var idx = 1; idx < pswd.length - 1; idx++) {
        ch = pswd.substr(idx, 1);

        if (ch == '@' || ch == '#' || ch == '$' || ch == '%' || ch == '&') {
            is_ok = true;
            break;
        }
    }

    return is_ok;
}

// onGetUserGroups : 查询用户组信息
function onGetUserGroups(select_id, group_id) {
    var reqUrl = getBaseUrl() + '/manage/user_group_query';
    var user_name = getAdministratorName();
    var postData = {};
    postData['time'] = new Date().getTime(); // 强制请求远端服务器

    httpPostRequest(reqUrl, user_name, postData, function(res){
        var rslt = res;
        // <option>无</option>
        var selected_text = '';
        var selected_index = 0;

        var innerHtml = '';
        var status = res['status'];
        if (status == 1) {
            var total_count = res['total_count'];
            var list = res['list'];
            if (total_count > 0 && list != undefined && list.length > 0) {
                for(var idx=0; idx < list.length; idx++) {
                    var itemData = list[idx];

                    var user_data = itemData.id;

                    innerHtml += '<option ';
                    innerHtml += ' id="' + itemData.id + '"';
                    innerHtml += ' value="' + itemData.weight + '"';
                    innerHtml += '>';
                    innerHtml += itemData.name;
                    innerHtml += '</option>';

                    if (group_id > 0 && group_id == itemData.id) {
                        selected_text = itemData.name;
                        selected_index = idx;
                    }
                }
            }
        }
        // 最后加 '无' 选项
        innerHtml += '<option>无</option>';

        var component = document.getElementById(select_id);
        if (component != undefined) {
            component.innerHTML = innerHtml;
        }

        // 选中指定项
        if (selected_text.length > 0) {
            //$("#" + select_id).val(selected_text);
            $("#" + select_id).find("option:contains('" + selected_text + "')").attr("selected", true);
        }
        else {
            $("#" + select_id).find("option:contains('无')").attr('selected', true);
        }
    });

}

// onCheckNameOnly : 检测用户名唯一性
function onCheckNameOnly() {
    var user_id = $("#private_user_id").val();
    var user_name = $("#username").val();

    var user_name_len = utilStrLen(user_name);
    if (user_name_len < 1) {
        $("#infoid").html('用户名称不能为空');
        return false;
    }
    else if (user_name_len > 20) {
        $("#infoid").html('用户名称太长，最大长度为20个字符');
        return false;
    }

    var reqUrl = getBaseUrl() + '/manage/user_name_verify';

    var postData = {
       id: user_id,
       name: user_name,
       time: new Date().getTime(),
    };

    var op_user_name = getAdministratorName();
    httpPostRequest(reqUrl, op_user_name, postData, function(res){
        var status = res['status'];
        var total_count = 0;
        if (status == 1) {
            total_count = res['total_count'];
        }
        if (total_count == 0) {
            // 用户名唯一
            $("#infoid").html('');
        }
        else {
            $("#infoid").html('此用户名称已经存在');
            // 清空无效数据
            $("#username").val('');
        }
    })

}

// onPaginationBtnClick: 分页事件
function onPaginationBtnClick(index) {
    var page_start_index = onGetPrivatePageStartIndex();
    var page_btns = onGetPrivatePageBtns();

    if (index == 0) {
        // 上一页
        var new_page_start_index = page_start_index - page_btns;
        if (new_page_start_index < 1) {
            new_page_start_index = 1;
        }
        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else if (index == -1) {
        // 下一页
        var new_page_start_index = page_start_index + page_btns;

        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else {
        onSetPrivatePageIndex(index);
    }

    var page_index = onGetPrivatePageIndex();
    var page_size = onGetPrivatePageSize();
    var page_count = onGetPrivatePageCount();

    var postData = {
        page_index: page_index,
        page_size: page_size,
        page_count: page_count,
        time: new Date().getTime(),
    }

    var tb_id = 'tb_data_body_id';
    var page_id = 'page_id';
    onQueryUserList(tb_id, page_id, postData);
}

// onUpdatePagination : 更新分页信息
function onUpdatePagination(page_id, page_index, page_size, page_btns, total_count, max_count, callback) {
    // 分页栏
    /*
     <!--<li><a href="#">&laquo;</a> </li>
     <li class="active"><a href="#">1</a> </li>
     <li><a href="#">2</a> </li>
     <li><a href="#">&raquo;</a> </li>-->
     */
    var innerHtml = '';
    if (max_count > total_count) {
        var page_arr = [];

        var page_start_index = onGetPrivatePageStartIndex();

        if (page_size < 1) {
            page_size = 20;
        }

        // 最大页序号
        var max_index = Math.ceil(max_count / page_size);

        // 起始页序号
        var begin_index = page_start_index;

        // 显示截止页序号
        var end_index = (page_start_index + page_btns - 1);
        end_index = end_index <= max_index ? end_index : max_index;

        if (begin_index > page_btns) {
            page_arr.push(0); // 上一页
        }

        for(var idx = begin_index; idx <= end_index; idx++) {
            page_arr.push(idx);
        }

        if (end_index < max_index) {
            page_arr.push(-1); // 下一页
        }

        if (page_arr.length <= 1) {
            // 不需要显示分页
        }
        else {
            for (key in page_arr) {
                var val = page_arr[key];
                if (val == 0) {
                    // 上一页
                    // <li><a href="#">&laquo;</a> </li>
                    innerHtml += '<li>';

                    innerHtml += '<a href="Javascript:void(0);"';
                    innerHtml += ' onclick="Javascript:' + callback + '(0);"';
                    innerHtml += '>';
                    innerHtml += '&laquo;';
                    innerHtml += '</a>';

                    innerHtml += '</li>';
                }
                else if (val == -1) {
                    // 下一页
                    // <li><a href="#">&raquo;</a> </li>
                    innerHtml += '<li>';

                    innerHtml += '<a href="Javascript:void(0);"';
                    innerHtml += ' onclick="Javascript:' + callback + '(-1);"';
                    innerHtml += '>';
                    innerHtml += '&raquo;';
                    innerHtml += '</a>';

                    innerHtml += '</li>';
                }
                else {
                    // <li><a href="#">1</a> </li>
                    innerHtml += '<li';
                    if (page_index == val) {
                        innerHtml += ' class="active"';
                    }
                    innerHtml += '>';

                    innerHtml += '<a href="Javascript:void(0);"';
                    innerHtml += ' onclick="Javascript:' + callback + '(' + val + ');"';
                    innerHtml += '>';
                    innerHtml += val;
                    innerHtml += '</a>';

                    innerHtml += '</li>';
                }
            }

        }

    }

    // 更新
    $("#" + page_id).html(innerHtml);
}

// onSubmitUserModify : 提交用户信息修改请求（包括添加和修改）
function onSubmitUserModify(component_id, postData) {
    var reqUrl = getBaseUrl() + '/manage/user_modify';
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 修改失败
            var msg = res['msg'];
            alert(msg);
        }
        else {
            // 重新加载
            //var itemData = list['data'];
            // 隐藏模态对话框
            $("#user_modal_dialog").modal('hide');
            // 刷新页面
            window.location.reload();
        }
    })

}

function onSubmitDelete(reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 删除失败
            var msg = res['msg'];
            alert(msg);
        }
        else {
            // 删除成功
        }
    });

}

// onQueryUserList : 查询用户列表
function onQueryUserList(tb_id, page_id, postData) {
    var reqUrl = getBaseUrl() + '/manage/user_query';
    var user_name = getAdministratorName();

    // 分页信息
    var page_index = postData['page_index'];
    var page_size = postData['page_size'];
    var page_count = postData['page_count'];

    var page_btns = onGetPrivatePageBtns();

    var begin_idx = (page_index - 1) * page_size;

    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = "";
        var status = res['status'];
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }
        else {
            var msg = res['msg'];
            onErrorHandle(status, msg);
            return false;
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_id = itemData.id;
                var item_name = itemData.name;
                var item_alias = itemData.alias;
                var item_pswd = itemData.pswd;
                var item_group_id = itemData.group_id;
                var item_group_name = itemData.group_name;
                var item_weight = itemData.weight;
                var item_status = itemData.status;
                var item_remark = itemData.remark;

                var item_status_text = onGetStatusText(item_status);

                if (item_group_name == null) {
                    item_group_name = '';
                }
                if (item_remark == null) {
                    item_remark = '';
                }

                var tb_tr = '<tr>';

                tb_tr += '<td style="width: 80px;">' + (begin_idx + idx + 1) + '</td>'; // 序号
                tb_tr += '<td style="width: 15%;">' + item_name + '</td>'; // 用户名
                tb_tr += '<td style="width: 15%;">' + item_alias + '</td>'; // 别名
                tb_tr += '<td style="width: 15%;">' + item_status_text + '</td>'; // 启用状态
                tb_tr += '<td style="width: 15%;">' + item_group_name + '</td>'; // 所属组
                tb_tr += '<td>' + item_remark + '</td>'; // 备注

                // 自定义属性，用分号分隔
                var item_user_data = item_name + ';' + item_alias + ';' + item_group_id + ';' + item_weight + ';' + item_status + ';' + item_remark;
                var user_data_attr = 'data-user-id="' + item_id + '"'; // 用户ID
                user_data_attr += ' data-user-data="' + item_user_data + '"'; // 用户组ID

                // 选项按钮
                tb_tr += '<td style="width: 280px;">';
                // 修改按钮
                tb_tr += '<input type="button" id="op_modify" ';
                tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onUserOptionClick(this, 1)" value="修改" />';

                // 修改密码按钮
                tb_tr += '&nbsp;&nbsp;<input type="button" id="op_modify_pswd" ';
                tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onUserOptionClick(this, 2)" value="修改密码" />';

                // 删除按钮
                if (!disabledDeleteUser(item_name) && item_weight != 0) {
                    tb_tr += '&nbsp;&nbsp;<input type="button" id="op_del" ';
                    tb_tr += user_data_attr;
                    tb_tr += ' onclick="JavaScript:onUserOptionClick(this, 3)" value="删除" />';
                }
                tb_tr += '</td>';

                tb_tr += '</tr>';

                innerHtml += tb_tr;
            }
        }

        // 更新列表
        $("#" + tb_id).html(innerHtml);

        // 更新状态栏
        var statusMaxsRecordsHtml = '记录数：' + total_count;
        $("#status_max_records_id").html(statusMaxsRecordsHtml);

        // 分页栏
        onUpdatePagination(page_id, page_index, page_size, page_btns, total_count, max_count, 'onPaginationBtnClick');

    })

}

function onAppPaginationBtnClick(index) {
    var page_start_index = onGetPrivatePageStartIndex();
    var page_btns = onGetPrivatePageBtns();

    if (index == 0) {
        // 上一页
        var new_page_start_index = page_start_index - page_btns;
        if (new_page_start_index < 1) {
            new_page_start_index = 1;
        }
        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else if (index == -1) {
        // 下一页
        var new_page_start_index = page_start_index + page_btns;

        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else {
        onSetPrivatePageIndex(index);
    }

    var page_index = onGetPrivatePageIndex();
    var page_size = onGetPrivatePageSize();
    var page_count = onGetPrivatePageCount();

    var postData = {
        page_index: page_index,
        page_size: page_size,
        page_count: page_count,
        time: new Date().getTime(),
    }

    var tb_id = 'tb_data_body_id';
    var page_id = 'page_id';
    onQueryAppList(tb_id, page_id, postData);
}

// 查询应用列表
function onQueryAppList(tb_id, page_id, postData) {
    var reqUrl = getBaseUrl() + '/manage/app_query';
    var user_name = getAdministratorName();

    // 分页信息
    var page_index = postData['page_index'];
    var page_size = postData['page_size'];
    var page_count = postData['page_count'];

    var page_btns = onGetPrivatePageBtns();

    var begin_idx = (page_index - 1) * page_size;

    var rslt = '';
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var data = res;

        var status = data['status'];
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = data['max_count'];
            total_count = data['total_count'];
        }
        else {
            var msg = data['msg'];
            onErrorHandle(status, msg);
        }

        // 解析应用列表
        var list = data['list'];
        if (list && list.length > 0) {
            for(var idx = 0; idx < list.length; idx++) {
                var item_node = list[idx];
                if (!item_node)
                    continue;

                var itemId = item_node['id'];
                var itemText = item_node['text'];
                var itemIcon = item_node['icon'];
                var itemGroupId = item_node['group_id'];
                var itemGroupName = item_node['group_name'];
                var itemStatus = item_node['status'];
                var remark = item_node['remark'];

                var itemStatusText = onGetStatusText(itemStatus);

                var app_tr = '<tr>';
                // checkbox <td><input type="checkbox" /></td>
                // app_tr += '<td><input type="checkbox" ></td>'; // 不用选项

                // 属性值
                // 序号
                app_tr += '<td id="' + itemId + '">';
                app_tr += (begin_idx + idx + 1);
                app_tr += '</td>';

                app_tr += '<td>' + itemText  +'</td>';

                // 图标
                var show_img = '../' + itemIcon;
                app_tr += '<td item_image="' + itemIcon + '"> ';
                app_tr += '<img src="' + show_img + '" ';
                app_tr += 'style="cursor:pointer;width:24px;height:24px;" ';
                app_tr += '/>';

                app_tr += '</td>';

                app_tr += '<td>' + itemStatusText  +'</td>';

                app_tr += '<td ';
                app_tr += 'id="' + itemGroupId + '" ';
                app_tr += '>' + itemGroupName  +'</td>';

                app_tr += '<td>' + remark + '</td>';

                // 自定义属性
                var user_data_attr = 'data-user-data="' + itemId + '" ';
                user_data_attr += 'data-user-text="' + itemText + '" ';

                // <td style="width:100px;"><input type="botton" onclick="JavaScript:window.location.href='test.html'" value="delete" /></td>

                app_tr += '<td style="width: 180px">';
                // 选项按钮
                app_tr += '<input type="button" id="op_modify" ';
                app_tr += user_data_attr;
                app_tr += ' onclick="JavaScript:appListClick(this, 1)" value="修改" />';

                app_tr += '&nbsp;&nbsp;<input type="button" id="op_del" ';
                app_tr += user_data_attr;
                app_tr += ' onclick="JavaScript:appListClick(this, 2)" value="删除" />';

                app_tr += '</td>';

                app_tr += '</tr>';

                rslt += app_tr;
            }
        }
        // 更新应用列表
        $("#" + tb_id).html(rslt);

        // 更新状态栏
        var statusMaxsRecordsHtml = '记录数：' + max_count;
        $("#status_max_records_id").html(statusMaxsRecordsHtml);

        // 分页栏
        onUpdatePagination(page_id, page_index, page_size, page_btns, total_count, max_count, 'onAppPaginationBtnClick');

    })

    return rslt;
}

function onAppModify(tb_id, app_id) {
    if (app_id < 1)
        return;

    var find = 0;
    var app_text = '';
    var app_image = '';
    var group_id = 0;
    var status = 0;
    var remark = '';

    var trList = $("#" + tb_id).children("tr");
    for(var i = 0; i < trList.length; i++) {
        var tdArr = trList.eq(i).find("td");
        var item_id = tdArr.eq("0").attr('id');
        if (item_id == app_id) {
            find = 1;

            app_text = tdArr.eq("1").text();
            app_image = tdArr.eq("2").attr('item_image');
            status = onGetStatusValue(tdArr.eq("3").text());
            group_id = tdArr.eq("4").attr('id');
            remark = tdArr.eq("5").text();
            break;
        }
    }

    if (find) {
        var targetUrl = getBaseUrl() + '/manage/app_modify.html';

        var params = '';
        params += 'id=' + app_id;
        params += '&app_text=' + getZhEncode(app_text);
        params += '&app_image=' + getZhEncode(app_image);
        params += '&group_id=' + group_id;
        params += '&status=' + status;
        params += '&remark=' + getZhEncode(remark);

        targetUrl += '?' + params;
        window.open(targetUrl);
    }
}

function onQueryAppImages(ctrl_id, reqUrl, postData, clickItemCallback) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var data = res;

        var innerHtml = '';

        var status = data['status'];
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = data['max_count'];
            total_count = data['total_count'];
        }

        // 解析应用列表
        var resData = [];
        if (total_count > 0) {

            var list = data['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_app_image =  itemData.rfolder + '/' + itemData.file_name;
                var user_data = itemData.id + ';' + itemData.file_name + ';' + itemData.text + ';' + item_app_image + ';' + itemData.remark;

                var resItemData = {
                    id: itemData.id,
                    name: itemData.text,
                    text: itemData.text,
                    image: getBaseUrl() + '/' + item_app_image,
                    remark: itemData.remark,
                    user_data: user_data
                }

                resData[idx] = resItemData;
            }
        }

        $("#" + ctrl_id).selecter({
            id: ctrl_id,
            data: resData,
            onclick: clickItemCallback
        })
    })

}

function onChangeSelectItem(select_id, value) {
    // 选中指定项
    document.getElementById(select_id).value = value;
}

// onGetHostGroups : 查询主机组信息
function onGetHostGroups(select_id, group_id) {
    var reqUrl = getBaseUrl() + '/manage/host_group_query';
    var postData = {};
    postData['time'] = new Date().getTime(); // 强制请求远端服务器

    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        // <option>无</option>
        var selected_text = '';
        var selected_index = 0;

        var innerHtml = '';
        var status = res['status'];
        if (status == 1) {
            var total_count = res['total_count'];
            var list = res['list'];
            if (total_count > 0 && list != undefined && list.length > 0) {
                for(var idx=0; idx < list.length; idx++) {
                    var itemData = list[idx];

                    innerHtml += '<option ';
                    innerHtml += ' id="' + itemData.id + '"';
                    innerHtml += ' value="' + itemData.name + '"';
                    innerHtml += '>';
                    innerHtml += itemData.name;
                    innerHtml += '</option>';

                    if (group_id > 0 && group_id == itemData.id) {
                        selected_text = itemData.name;
                        selected_index = idx;
                    }
                }
            }
        }
        // 最后加 '无' 选项
        innerHtml += '<option>无</option>';

        var component = document.getElementById(select_id);
        if (component != undefined) {
            component.innerHTML = innerHtml;
        }

        // 选中指定项
        if (selected_text.length > 0) {
            //$("#" + select_id).val(selected_text);
            $("#" + select_id).find("option:contains('" + selected_text + "')").attr("selected", true);
        }
        else {
            $("#" + select_id).find("option:contains('无')").attr('selected', true);
        }
    })

}

// onCheckHostIpaddrOnly : 检测主机IP地址唯一性
function onCheckHostIpaddrOnly() {
    var host_id = $("#private_host_id").val();
    var host_ip_addr = $("#hostipaddr").val();

    var reqUrl = getBaseUrl() + '/manage/host_ip_addr_verify';

    var postData = {
        id: host_id,
        ip_addr: host_ip_addr,
        time: new Date().getTime(),
    };

    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        var total_count = 0;
        if (status == 1) {
            total_count = res['total_count'];
        }
        if (total_count == 0) {
            // 主机名唯一
            $("#infoid").html('');
        }
        else {
            $("#infoid").html('此主机已经存在');
            // 清空无效数据
            $("#hostipaddr").val('');
            return false;
        }
    })

}

function onCheckIpv4Valid(ipaddr) {
    var vals = ipaddr.split('.');
    if (vals.length != 4) {
        $("#infoid").html('IP地址长度错误');
        return false;
    }
    for(var idx=0; idx<vals.length; idx++) {
        try {
            var v = parseInt(vals[idx]);
            if (v < 0 || v > 255) {
                $("#infoid").html(v + ' 值越界，只能填写 0 ~ 255 之间的值');
                return false;
            }
        }
        catch(e) {
            $("#infoid").html('非法IP地址');
            return false;
        }
    }
    $("#infoid").html('');
    return true;
}

// onSubmitHostModify : 提交主机信息修改请求（包括添加和修改）
function onSubmitHostModify(component_id, postData) {
    var reqUrl = getBaseUrl() + '/manage/host_modify';
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 修改失败
            var msg = res['msg'];
            alert(msg);
        }
        else {
            // 重新加载
            //var itemData = list['data'];
            // 隐藏模态对话框
            //$("#host_modal_dialog").modal('hide');
            $("#" + component_id).modal('hide');
            // 刷新页面
            window.location.reload();
        }
    })

}

function onHostPaginationBtnClick(index) {
    var page_start_index = onGetPrivatePageStartIndex();
    var page_btns = onGetPrivatePageBtns();

    if (index == 0) {
        // 上一页
        var new_page_start_index = page_start_index - page_btns;
        if (new_page_start_index < 1) {
            new_page_start_index = 1;
        }
        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else if (index == -1) {
        // 下一页
        var new_page_start_index = page_start_index + page_btns;

        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else {
        onSetPrivatePageIndex(index);
    }

    var page_index = onGetPrivatePageIndex();
    var page_size = onGetPrivatePageSize();
    var page_count = onGetPrivatePageCount();

    var postData = {
        page_index: page_index,
        page_size: page_size,
        page_count: page_count,
        time: new Date().getTime(),
    }

    var tb_id = 'tb_data_body_id';
    var page_id = 'page_id';
    onQueryHostList(tb_id, page_id, postData);
}

// onQueryHostList : 查询主机列表
function onQueryHostList(tb_id, page_id, postData) {
    var reqUrl = getBaseUrl() + '/manage/host_query';
    var user_name = getAdministratorName();

    // 分页信息
    var page_index = postData['page_index'];
    var page_size = postData['page_size'];
    var page_count = postData['page_count'];

    var page_btns = onGetPrivatePageBtns();

    var begin_idx = (page_index - 1) * page_size;

    httpPostRequest(reqUrl, user_name, postData, function(res){

        var innerHtml = "";
        var status = res['status'];
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }
        else {
            var msg = res['msg'];
            onErrorHandle(status, msg);
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_id = itemData.id;
                var item_name = itemData.name;
                var item_ip_addr = itemData.ip_addr;
                var item_status = itemData.status;
                var item_group_id = itemData.group_id;
                var item_group_name = itemData.group_name;
                var item_remark = itemData.remark;

                if (item_group_name == null) {
                    item_group_name = '';
                }

                if (item_remark == null) {
                    item_remark = '';
                }

                var item_status_text = onGetStatusText(item_status);

                var tb_tr = '<tr>';

                tb_tr += '<td style="width: 80px;">' + (begin_idx + idx + 1) + '</td>'; // 序号
                tb_tr += '<td style="width: 15%;">' + item_name + '</td>'; // 主机户名
                tb_tr += '<td style="width: 15%;">' + item_ip_addr + '</td>'; // IP
                tb_tr += '<td style="width: 15%;">' + item_status_text + '</td>'; // 状态
                tb_tr += '<td style="width: 15%;">' + item_group_name + '</td>'; // 所属组
                tb_tr += '<td>' + item_remark + '</td>'; // 备注

                // 自定义属性
                var item_user_data = item_name;
                item_user_data += ';' + item_ip_addr;
                item_user_data += ';' + item_status;
                item_user_data += ';' + item_group_id;
                item_user_data += ';' + item_remark;

                var user_data_attr = 'data-user-id="' + item_id + '"'; // 用户ID
                user_data_attr += ' data-user-data="' + item_user_data + '"'; // 用户组ID

                // 选项按钮
                tb_tr += '<td style="width: 180px">';
                // 修改按钮
                tb_tr += '<input type="button" id="op_modify" ';
                tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onHostOptionClick(this, 1)" value="修改" />';
                // 删除按钮
                tb_tr += '&nbsp;&nbsp;<input type="button" id="op_del" ';
                tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onHostOptionClick(this, 2)" value="删除" />';

                tb_tr += '</td>';

                tb_tr += '</tr>';

                innerHtml += tb_tr;
            }
        }

        // 更新列表
        $("#" + tb_id).html(innerHtml);

        // 更新状态栏
        var statusMaxsRecordsHtml = '记录数：' + total_count;
        $("#status_max_records_id").html(statusMaxsRecordsHtml);

        // 分页栏
        onUpdatePagination(page_id, page_index, page_size, page_btns, total_count, max_count, 'onHostPaginationBtnClick');

    })

}

function onQueryHosts(ctrl_id, reqUrl, postData, clickItemCallback) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){

        var status = res['status'];
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }

        if (total_count > 0) {
            var resData = [];
            var list = res['list'];
            for (var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_id = itemData.id;
                var item_name = itemData.name;
                var item_ip_addr = itemData.ip_addr;
                var item_status = itemData.status;
                var item_group_id = itemData.group_id;
                var item_group_name = itemData.group_name;
                var item_remark = itemData.remark;

                var item_image = getDefaultHostImage(item_status);

                var item_user_data = item_id + ';' + item_name + ';' + item_ip_addr + ';' + item_remark;

                var resItemData = {
                    id: item_id,
                    name: item_name,
                    text: item_ip_addr,
                    image: item_image,
                    remark: item_remark,
                    user_data: item_user_data
                }

                resData[idx] = resItemData;
            }
        }

        $("#" + ctrl_id).selecter({
            id: ctrl_id,
            data: resData,
            onclick: clickItemCallback
        })
    })

}

// onQueryGroups: 查询组列表
function onQueryGroups(tb_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = "";
        var status = res['status'];
        var total_count = 0;
        if (status == 1) {
            total_count = res['total_count'];
        }
        else {
            var msg = res['msg'];
            onErrorHandle(status, msg);
        }

        if (total_count > 0) {
            var list = res['list'];
            for (var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_id = itemData.id;
                var item_name = itemData.name;
                var item_count = itemData.count;
                var item_remark = itemData.remark;

                var tb_tr = '<tr>';

                // 自定义属性，用分号分隔
                var item_user_data = item_name + ';' + item_remark;
                var user_data_attr = 'data-user-id="' + item_id + '"'; // 用户ID
                user_data_attr += ' data-user-data="' + item_user_data + '"'; // 用户组ID

                tb_tr += '<td style="width: 80px;">' + (idx + 1) + '</td>'; // 序号
                tb_tr += '<td style="width: 20%;">' + item_name + '</td>'; // 组名称
                tb_tr += '<td style="width: 20%;">' + item_count + '</td>'; // 成员数
                tb_tr += '<td style="width: 30%;">' + item_remark + '</td>'; // 备注

                // 详情信息
                tb_tr += '<td style="width: 80px;">';
                // 说情按钮
                tb_tr += '<input type="button" id=op_detail ';
                tb_tr += ' onclick="Javascript:onGroupDetailClick(' + item_id + ');" value="组成员管理" />';
                tb_tr += '</td>';

                // 选项按钮
                tb_tr += '<td style="width: 120px;">';
                // 修改按钮
                tb_tr += '<input type="button" id="op_modify" ';
                tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onGroupOptionClick(this, 1)" value="修改" />';
                // 删除按钮
                tb_tr += '&nbsp;&nbsp;<input type="button" id="op_del" ';
                tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onGroupOptionClick(this, 2)" value="删除" />';

                tb_tr += '</td>';

                tb_tr += '</tr>';

                innerHtml += tb_tr;
            }
        }

        // 更新列表
        $("#" + tb_id).html(innerHtml);

        // 更新状态栏
        var statusMaxsRecordsHtml = '记录数：' + total_count;
        $("#status_max_records_id").html(statusMaxsRecordsHtml);
    })

}

function onQueryAppGroupSelectList(ctrl_id, group_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = "";

        innerHtml += '<option id="0">无</option>';

        var status = res['status'];
        var total_count = 0;
        if (status == 1) {
            total_count = res['total_count'];
        }
        if (total_count > 0) {
            var list = res['list'];

            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                //var item_id = itemData.id;
                //var item_name = itemData.name;
                //var item_remark = itemData.remark;
                //var item_count = itemData.count;

                innerHtml += '<option ';
                innerHtml += ' id="' + itemData.id + '" ';
                if (group_id == itemData.id) {
                    innerHtml += 'selected="true" ';
                }
                innerHtml += '>';
                innerHtml += itemData.name;
                innerHtml += '</option>';
            }
        }

        // 更新列表
        $("#" + ctrl_id).html(innerHtml);
    })

}

// onCheckGroupNameOnly : 检测组名唯一性
function onCheckGroupNameOnly(info_ctrl_id, ctrl_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status == 1) {
            // 用户名唯一
            $("#" + info_ctrl_id).html('');
        }
        else {
            var msg = res['msg'];
            $("#" + info_ctrl_id).html(msg);
            // 清空无效数据
            $("#" + ctrl_id).val('');
        }
    })

}

function onSubmitGroupModify(component_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 修改失败
            var msg = res['msg'];
            alert(msg);
        }
        else {
            // 重新加载
            //var itemData = list['data'];
            // 隐藏模态对话框
            $("#" + component_id).modal('hide');
            // 刷新页面
            window.location.reload();
        }
    })

}

function onSetGroupNavData(ctrl_id, reqUrl, postData, nav_head_text) {

    /*
     <a href="Javascript:void(0);" class="list-group-item active">
     <h4 class="list-group-item-heading">
     资源类型
     </h4>
     </a>
     <a href="#" class="list-group-item">
     <p class="list-group-item-text">
     用户组一
     </p>
     </a>
     */

    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){

        var def_group_id = 0;
        var innerHtml = '';

        innerHtml += '<a href="Javascript:void(0);" class="list-group-item active">';
        innerHtml += '<h4 class="list-group-item-heading">' + nav_head_text + '</h4>';
        innerHtml += '</a>';

        var status = res['status'];
        if (status == 1) {
            var total_count = res['total_count'];
            var list = res['list'];

            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var id = itemData.id;
                var name = itemData.name;
                var remark = itemData.remark;

                if (idx == 0) {
                    def_group_id = id;
                }

                innerHtml += '<a href="Javascript:onNavGroupItemClick(' + id + ');" ';
                innerHtml += 'class="list-group-item">';
                innerHtml += '<p class="list-group-item-text">' + name + '</p>';
                innerHtml += '</a>';

                //innerHtml += '<br />'; // 换行
            }
        }

        // 其它
        innerHtml += '<a href="Javascript:onNavGroupItemClick(0);" ';
        innerHtml += 'class="list-group-item">';
        innerHtml += '<p class="list-group-item-text">未分组成员</p>';
        innerHtml += '</a>';

        // 所有
        innerHtml += '<a href="Javascript:onNavGroupItemClick(-1);" ';
        innerHtml += 'class="list-group-item">';
        innerHtml += '<p class="list-group-item-text">所有成员</p>';
        innerHtml += '</a>';

        // 更新数据
        $("#" + ctrl_id).html(innerHtml);

        // 选中默认组
        onNavGroupItemClick(-1);
    })

}

function onSetUserSimpleData(ctrl_id, reqUrl, postData) {
    /*
     <div class="wrap-item">
     <div class="wrap-item-img">
     <img src="../images/user3.png">
     </div>
     <div class="wrap-item-text">
     div2
     </div>
     <div class="wrap-item-checkbox">
     <input type="checkbox" name="category" value="" />
     </div>
     </div>
     */
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        var innerHtml = '';
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var id = itemData.id;
                var name = itemData.name;
                var remark = itemData.remark;

                var item_img = getDefaultUserImage();
                var user_data = id + ';' + name + ';' + remark;

                innerHtml += '<div class="wrap-item"';
                innerHtml += ' id="' + id + '"';
                innerHtml += ' user-data="' + user_data + '"';
                innerHtml += '>';

                innerHtml += '<div class="wrap-item-img">';
                innerHtml += '<img src="' + item_img + '">'
                innerHtml += '</div>';

                innerHtml += '<div class="wrap-item-text">';
                innerHtml += name;
                innerHtml += '</div>';

                innerHtml += '<div class="wrap-item-input">';
                innerHtml += '<input type="checkbox" name="inside" value="" />';
                innerHtml += '</div>';

                innerHtml += '</div>';
            }
        }

        // 更新数据
        $("#" + ctrl_id).html(innerHtml);
    })

}

function onSetAppSimpleData(ctrl_id, reqUrl, postData) {
    /*
     <div class="wrap-item">
     <div class="wrap-item-img">
     <img src="../images/user3.png">
     </div>
     <div class="wrap-item-text">
     div2
     </div>
     <div class="wrap-item-checkbox">
     <input type="checkbox" name="category" value="" />
     </div>
     </div>
     */

    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        var innerHtml = '';
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var id = itemData.id;
                var text = itemData.app_text;
                var image = itemData.app_image;
                var remark = itemData.remark;

                var user_data = id + ';' +text + ';' + image + ';' + remark;

                var item_img = getBaseUrl() + '/' + image;

                innerHtml += '<div class="wrap-item"';
                innerHtml += ' id="' + id + '"';
                innerHtml += ' user-data="' + user_data + '"';
                innerHtml += '>';

                innerHtml += '<div class="wrap-item-img">';
                innerHtml += '<img src="' + item_img + '">'
                innerHtml += '</div>';

                innerHtml += '<div class="wrap-item-text">';
                innerHtml += text;
                innerHtml += '</div>';

                innerHtml += '<div class="wrap-item-input">';
                innerHtml += '<input type="checkbox" name="inside" value="" />';
                innerHtml += '</div>';

                innerHtml += '</div>';
            }
        }

        // 更新数据
        $("#" + ctrl_id).html(innerHtml);
    })

}

function onSetHostSimpleData(ctrl_id, reqUrl, postData) {
    /*
     <div class="wrap-item">
     <div class="wrap-item-img">
     <img src="../images/user3.png">
     </div>
     <div class="wrap-item-text">
     div2
     </div>
     <div class="wrap-item-checkbox">
     <input type="checkbox" name="category" value="" />
     </div>
     </div>
     */

    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){

        var status = res['status'];
        var innerHtml = '';
        var max_count = 0;
        var total_count = 0;
        if (status == 1) {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var id = itemData.id;
                var name = itemData.name;
                var ip_addr = itemData.ip_addr;
                var status = itemData.status;
                var group_id = itemData.group_id;
                var group_name = itemData.group_name;
                var remark = itemData.remark;

                var user_data = id + ';' + name + ';' + ip_addr + ';' + remark;

                var item_img = getDefaultHostImage();

                innerHtml += '<div class="wrap-item"';
                innerHtml += ' id="' + id + '"';
                innerHtml += ' user-data="' + user_data + '"';
                innerHtml += '>';

                innerHtml += '<div class="wrap-item-img">';
                innerHtml += '<img src="' + item_img + '">'
                innerHtml += '</div>';

                innerHtml += '<div class="wrap-item-text">';
                innerHtml += ip_addr;
                innerHtml += '</div>';

                innerHtml += '<div class="wrap-item-input">';
                innerHtml += '<input type="checkbox" name="inside" value="" />';
                innerHtml += '</div>';

                innerHtml += '</div>';
            }
        }

        // 更新数据
        $("#" + ctrl_id).html(innerHtml);
    })

}

function onSubmitRequest(reqUrl, user_name, postData) {
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 修改失败
            var msg = res['msg'];
            alert(msg);
        }
        else {
            // 修改成功
            // 刷新父窗口
            if (window.opener && !window.opener.closed) {
                window.opener.location.reload();
            }
            window.close();
        }
    })

}

function onNoCloseSubmitRequest(reqUrl, user_name, postData) {

    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 修改失败
            var msg = res['msg'];
            alert(msg);
        }
        else {
            // 修改成功
            // 刷新窗口
            window.location.reload();

            // 刷新父窗口
            if (window.opener && !window.opener.closed) {
                window.opener.location.reload();
            }
        }
    })

}

function onUserAuthPaginationBtnClick(index) {
    var page_start_index = onGetPrivatePageStartIndex();
    var page_btns = onGetPrivatePageBtns();

    if (index == 0) {
        // 上一页
        var new_page_start_index = page_start_index - page_btns;
        if (new_page_start_index < 1) {
            new_page_start_index = 1;
        }
        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else if (index == -1) {
        // 下一页
        var new_page_start_index = page_start_index + page_btns;

        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else {
        onSetPrivatePageIndex(index);
    }

    var page_index = onGetPrivatePageIndex();
    var page_size = onGetPrivatePageSize();
    var page_count = onGetPrivatePageCount();

    var reqUrl = getBaseUrl() + "/manage/app_auth_query";

    var postData = {
        page_index: page_index,
        page_size: page_size,
        page_count: page_count,
        time: new Date().getTime(),
    }

    var tb_id = 'tb_data_body_id';
    var page_id = 'page_id';
    onQueryUserAuthDatas(tb_id, page_id, reqUrl, postData);
}

function onQueryUserAuthDatas(ctrl_id, page_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = '';
        var status = res['status'];
        var max_count = 0;
        var total_count = 0;
        if (status != 1) {
            var msg = res['msg'];
            onErrorHandle(status, msg);
        }
        else {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_user_id = itemData.user_id;
                var item_user_name = itemData.user_name;
                var item_app_count = itemData.app_count;

                // 自定义属性，用分号分隔
                var user_data_attr = 'data-id="' + item_user_id + '"';
                user_data_attr += ' data-name="' + item_user_name + '"';

                var tb_tr = '<tr ';
                tb_tr += user_data_attr;
                tb_tr += '>'

                tb_tr += '<td style="width: 80px;">' + (idx + 1) + '</td>'; // 序号
                tb_tr += '<td style="width: 30%;">' + item_user_name + '</td>'; // 用户名称
                tb_tr += '<td style="width: 30%;">' + item_app_count + '</td>'; // 应用个数

                // 选项按钮
                tb_tr += '<td style="width: 120px;">';
                // 修改按钮
                tb_tr += '<input type="button" id="op_modify" ';
                //tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onAuthOptionClick(this, 1)" value="修改" />';
                // 删除按钮
                tb_tr += '&nbsp;&nbsp;<input type="button" id="op_del" ';
                //tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onAuthOptionClick(this, 2)" value="删除" />';

                tb_tr += '</td>';

                tb_tr += '</tr>';

                innerHtml += tb_tr;
            }
        }

        // 更新页面
        $("#" + ctrl_id).html(innerHtml);

        // 更新状态栏
        var statusMaxsRecordsHtml = '记录数：' + max_count;
        $("#status_max_records_id").html(statusMaxsRecordsHtml);

        // 分页栏
        var page_index = postData['page_index'];
        var page_size = postData['page_size'];
        var page_count = postData['page_count'];

        var page_btns = onGetPrivatePageBtns();

        onUpdatePagination(page_id, page_index, page_size, page_btns, total_count, max_count, 'onUserAuthPaginationBtnClick');
    })

}

function onHostAuthPaginationBtnClick(index) {

    var page_start_index = onGetPrivatePageStartIndex();
    var page_btns = onGetPrivatePageBtns();

    if (index == 0) {
        // 上一页
        var new_page_start_index = page_start_index - page_btns;
        if (new_page_start_index < 1) {
            new_page_start_index = 1;
        }
        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else if (index == -1) {
        // 下一页
        var new_page_start_index = page_start_index + page_btns;

        onSetPrivatePageStartIndex(new_page_start_index);
        onSetPrivatePageIndex(new_page_start_index);
    }
    else {
        onSetPrivatePageIndex(index);
    }

    var page_index = onGetPrivatePageIndex();
    var page_size = onGetPrivatePageSize();
    var page_count = onGetPrivatePageCount();

    var reqUrl = getBaseUrl() + "/manage/host_auth_query";
    var postData = {
        page_index: page_index,
        page_size: page_size,
        page_count: page_count,
        time: new Date().getTime(),
    }

    var tb_id = 'tb_data_body_id';
    var page_id = 'page_id';
    onQueryHostAuthDatas(tb_id, page_id, reqUrl, postData);
}

function onQueryHostAuthDatas(ctrl_id, page_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = '';
        var status = res['status'];
        var max_count = 0;
        var total_count = 0;

        if (status != 1) {
            var msg = res['msg'];
            onErrorHandle(status, msg);
        }
        else {
            max_count = res['max_count'];
            total_count = res['total_count'];
        }

        if (total_count > 0) {
            var list = res['list'];
            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_user_id = itemData.user_id;
                var item_user_name = itemData.user_name;
                var item_host_count = itemData.host_count;

                // 自定义属性，用分号分隔
                var user_data_attr = 'data-id="' + item_user_id + '"';
                user_data_attr += ' data-name="' + item_user_name + '"';

                var tb_tr = '<tr ';
                tb_tr += user_data_attr;
                tb_tr += '>'

                tb_tr += '<td style="width: 80px;">' + (idx + 1) + '</td>'; // 序号
                tb_tr += '<td style="width: 30%;">' + item_user_name + '</td>'; // 主机名称
                tb_tr += '<td style="width: 30%;">' + item_host_count + '</td>'; // 用户个数

                // 选项按钮
                tb_tr += '<td style="width: 120px;">';
                // 修改按钮
                tb_tr += '<input type="button" id="op_modify" ';
                //tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onAuthOptionClick(this, 1)" value="修改" />';
                // 删除按钮
                tb_tr += '&nbsp;&nbsp;<input type="button" id="op_del" ';
                //tb_tr += user_data_attr;
                tb_tr += ' onclick="JavaScript:onAuthOptionClick(this, 2)" value="删除" />';

                tb_tr += '</td>';

                tb_tr += '</tr>';

                innerHtml += tb_tr;
            }
        }

        // 更新页面
        $("#" + ctrl_id).html(innerHtml);

        // 更新状态栏
        var statusMaxsRecordsHtml = '记录数：' + max_count;
        $("#status_max_records_id").html(statusMaxsRecordsHtml);

        // 分页栏
        var page_index = postData['page_index'];
        var page_size = postData['page_size'];
        var page_count = postData['page_count'];

        var page_btns = onGetPrivatePageBtns();

        onUpdatePagination(page_id, page_index, page_size, page_btns, total_count, max_count, 'onHostAuthPaginationBtnClick');
    })
}

function onCheckFieldOnly(warning_ctrl_id, data_ctrl_id, reqUrl, postData) {
    httpPostRequest(reqUrl, postData, function(res){
        var item_id = 0;
        var msg = '';
        var status = res['status'];
        if (status == 1) {
            var total_count = res['total_count'];
            if (total_count > 0) {
                item_id = res['list'][0].id;
            }
        }
        else {
            msg = '验证失败';
        }

        $("#" + warning_ctrl_id).html(msg);
        $("#" + data_ctrl_id).val(item_id);
    })

}

function onSubmitWarningRequest(warning_ctrl_id, ctrl_id, reqUrl, postData) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var status = res['status'];
        if (status != 1) {
            // 失败
            var msg = res['msg'];
            //alert(msg);
            $("#" + warning_ctrl_id).html(msg);
            $("#" + ctrl_id).val('');
        }
        else {
            // 删除成功
            $("#" + warning_ctrl_id).html('');
        }
    })

}
