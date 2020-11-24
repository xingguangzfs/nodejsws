/**
 * Created by fushou on 2019/9/27.
 */

function onSetPrivatePageStartIndex(val) {
    $("#private_page_start_index").attr('value', val);
}

function onGetPrivatePageStartIndex() {
    var strValue = $("#private_page_start_index").val();
    var val = 0;
    try {
        val = parseInt(strValue);
    }
    catch(err) {

    }
    return val;
}

function onSetPrivatePageIndex(val) {
    $("#private_page_index").attr('value', val);
}

function onGetPrivatePageIndex() {
    var strValue = $("#private_page_index").val();
    var val = 0;
    try {
        val = parseInt(strValue);
    }
    catch(err) {

    }
    return val;
}

function onSetPrivatePageSize(val) {
    $("#private_page_size").attr('value', val);
}

function onGetPrivatePageSize() {
    var strValue = $("#private_page_size").val();
    var val = 0;
    try {
        val = parseInt(strValue);
    }
    catch(err) {

    }
    return val;
}

function onSetPrivatePageCount(val) {
    $("#private_page_count").attr('value', val);
}

function onGetPrivatePageCount() {
    var strValue = $("#private_page_count").val();
    var val = 0;
    try {
        val = parseInt(strValue);
    }
    catch(err) {

    }
    return val;
}

function onSetPrivatePageBtns(val) {
    $("#private_page_btns").attr('value', val);
}

function onGetPrivatePageBtns() {
    var strValue = $("#private_page_btns").val();
    var val = 0;
    try {
        val = parseInt(strValue);
    }
    catch(err) {

    }
    return val;
}

function onRestructDatetime(dt, def_time) {
    var fmt_dt = '';

    var fmt_date = '';
    var fmt_time = '';

    var dt_arr = dt.split('T');

    if (dt_arr.length <= 0) {
        dt_arr = dt.split(' ');
    }
    if (dt_arr.length >= 2) {
        fmt_date = dt_arr[0];

        var fmt_time_arr = dt_arr[1].split(':');
        if (fmt_time_arr.length >= 3) {
            fmt_time = fmt_time_arr[0] + ':' + fmt_time_arr[1] + ':' + fmt_time_arr[2];
        }
        else if (fmt_time_arr.length >= 2) {
            fmt_time = fmt_time_arr[0] + ':' + fmt_time_arr[1];
        }
        else {
            fmt_time = def_time;
        }
    }
    else {

    }

    if (fmt_date != '' && fmt_time != '') {
        fmt_dt = fmt_date + ' ' + fmt_time;
    }

    return fmt_dt;
}

function onAddDate(date ,days){
    var d = new Date(date);
    d.setDate(d.getDate()+days);
    return d;
}

function onInitDateInput() {
    // 2015-09-24T13:59:59
    var cur_dt = new Date();
    var temp_dt = onAddDate(cur_dt, -7);

    var temp_dt_fmt = temp_dt.getFullYear() + '-' + (temp_dt.getMonth() + 1) + '-' + temp_dt.getDate();
    var start_dt_fmt = temp_dt_fmt + ' 00:00:00';

    var cur_dt_fmt = cur_dt.getFullYear() + '-' + (cur_dt.getMonth() + 1) + '-' + cur_dt.getDate()
    var end_dt_fmt = cur_dt_fmt + ' 23:59:59';


    $("#start_dt").attr('value', start_dt_fmt);
    $("#end_dt").attr('value', end_dt_fmt);

    $("#start_dt").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',
        language:'zh-CN',
        datepicket: true, // 显示日期选择部分
        timepicker: true, // 显示时间选择部分
        autoclose: true,//选中自动关闭
        value: start_dt_fmt,
        onChangeDateTime: function(dp, $input) {

        },
        onClose: function(current_time, $input) {

        }
    });

    $("#end_dt").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',
        language: 'zh-CN',
        datepicket: true, // 显示日期选择部分
        timepicker: true, // 显示时间选择部分
        autoclose: true,//选中自动关闭
        value: end_dt_fmt,
        onChangeDateTime: function(dp, $input) {

        },
        onClose: function(current_time, $input) {

        }
    });
}

function onGetInputDate(postData) {
    var start_dt = $("#start_dt").val();
    var end_dt =$("#end_dt").val();

    //start_dt = onRestructDatetime(start_dt, '00:00:00');
    //end_dt = onRestructDatetime(end_dt, '23:59:59');

    if (start_dt != undefined && start_dt != null && start_dt != '') {
        postData['start_date'] = start_dt;
    }

    if (end_dt != undefined && end_dt != null && end_dt != '') {
        postData['end_date'] = end_dt;
    }
}

function onGetLogLevelImage(level_id) {
    var img = '../images/';

    switch(level_id) {
        case 2:
        { // 警告
            img += 'warn.png';
        }break;

        case 3:
        { // 错误
            img += 'error.png';
        }break;

        default: {
            img += 'info.png';
        }break;
    }
    return img;
}

function onGetLogLevel(ctrl_id, checkbox_name, onClickCallbackName) {
    var reqUrl = getBaseUrl() + '/log/log_level_query';
    var user_name = getAdministratorName();
    var postData = {
        time: new Date().getTime()
    }

    httpPostRequest(reqUrl, user_name, postData, function(res){
        var list = null;

        var status = res['status'];
        if (status == 1) {
            list = res['list'];
        }

        onUpdateCheckboxList(list, ctrl_id, checkbox_name, 'log_level_', onClickCallbackName);
    });
}

function onGetLogEvent(min, max, ctrl_id, checkbox_name, onClickCallbackName) {
    var reqUrl = getBaseUrl() + '/log/log_event_query';
    var user_name = getAdministratorName();
    var postData = {
        min: min,
        max: max,
        time: new Date().getTime()
    }

    httpPostRequest(reqUrl, user_name, postData, function(res){
        var list = null;

        var status = res['status'];
        if (status == 1) {
            list = res['list'];
        }

        onUpdateCheckboxList(list, ctrl_id, checkbox_name, 'log_event_', onClickCallbackName);
    });
}

function onUpdateCheckboxList(list, ctrl_id, checkbox_name, id_prefix, onClickCallbackName) {
    /*
     <div class="flex-item">
     <span><input type="checkbox" id="log_level_0" onclick="Javascript:onClick(this);">&nbsp;&nbsp;全选</span>
     </div>
    */

    var innerHtml = '';

    // 全选项
    innerHtml += '<div class="flex-item" ';
    innerHtml += 'user-data-id="0" ';
    innerHtml += 'user-data-name="全选" ';
    innerHtml += '>';

    innerHtml += '<span>';
    innerHtml += '<input type="checkbox" ';
    innerHtml += 'id="' + id_prefix + '0" ';
    innerHtml += 'name="' + checkbox_name + '" ';
    innerHtml += 'value="' + '0" ';
    innerHtml += 'onclick="Javascript:' + onClickCallbackName + '(this);"';
    innerHtml += '>';
    innerHtml += '&nbsp;&nbsp;全选';
    innerHtml += '</span>';

    innerHtml += '</div>';

    if (list && list.length > 0) {
        for(var idx = 0; idx < list.length; idx++) {
            var itemData = list[idx];

            var item_id = itemData.id;
            var item_name = itemData.name;

            var item_id_string = item_id.toString();

            innerHtml += '<div class="flex-item" ';
            innerHtml += 'user-data-id="' + item_id_string + '" ';
            innerHtml += 'user-data-name="' + item_name + '" ';
            innerHtml += '>';

            innerHtml += '<span>';
            innerHtml += '<input type="checkbox" ';
            innerHtml += 'id="' + id_prefix + item_id_string + '" ';
            innerHtml += 'name="' + checkbox_name + '" ';
            innerHtml += 'value="' + item_id_string + '" ';
            innerHtml += 'onclick="Javascript:' + onClickCallbackName + '(this);"';
            innerHtml += '>';
            innerHtml += '&nbsp;&nbsp;' + item_name;
            innerHtml += '</span>';

            innerHtml += '</div>';

        }
    }

    $("#" + ctrl_id).html(innerHtml);
}

function onGetCheckboxSelectedList(checkbox_name) {
    var elems = document.getElementsByName(checkbox_name);

    var datas = [];

    if (elems == undefined || elems == null || elems.length < 1) {
        return null;
    }

    for(var idx=0; idx < elems.length; idx++) {
        var item = elems[idx];
        if (item.checked && item.value != null) {
            datas.push(item.value);
        }
    }

    return datas;
}

function onSetCheckboxSelected(checkbox_name, item_index, checked) {

    var elems = document.getElementsByName(checkbox_name);

    if (elems == undefined || elems == null || elems.length < 1) {
        return;
    }

    item_index = parseInt(item_index);

    if (item_index == 0) {
        // 全选项
        for(var idx=0; idx < elems.length; idx++) {
            var item = elems[idx];

            if (checked != item.checked) {
                item.checked = checked;
            }
        }
    }
    else {
        // 判断是否需要选中全选按钮
        var full_checked = true;

        // 判断是否选中
        for(var idx=0; idx < elems.length; idx++) {
            var item = elems[idx];

            var item_value = item.getAttribute('value');
            item_value = parseInt(item_value);

            if (item_value != 0) {
                if (!item.checked) {
                    full_checked = false;
                    break;
                }
            }
        }

        // 修改全选项值
        for(var idx=0; idx < elems.length; idx++) {
            var item = elems[idx];

            var item_value = item.getAttribute('value');
            item_value = parseInt(item_value);

            if (item_value == 0 && (item.checked != full_checked)) {
                item.checked = full_checked;
                break;
            }
        }

    }
}

function onLogParamIsEmpty(key, log_level_list, log_event_list) {
    if (!utilIsEmpty(key)) {
        return false;
    }

    if ((log_level_list == undefined || log_level_list == null || log_level_list.length < 1) ||
        (log_event_list == undefined || log_event_list == null || log_event_list.length < 1)) {
        return true;
    }
    return false;
}

function onPageResetData() {
    var index = 1;
    onSetPrivatePageStartIndex(index);
    onSetPrivatePageIndex(index);
}

function onPageUpdate(ctrl_id, page_click, max_count, page_start_index, page_index, page_size, page_btns) {
    var page_arr = [];
    // 起始页序号
    if (page_start_index < 1) {
        page_start_index = 1;
    }

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

    /*var obj = {
        begin: begin_index,
        end: end_index,
        max: max_index,
        btn: page_btns,
        max_count: max_count
    }
    alert(JSON.stringify(obj));*/

    for(var idx = begin_index; idx <= end_index; idx++) {
        page_arr.push(idx);
    }

    if (end_index < max_index) {
        page_arr.push(-1); // 下一页
    }

    var innerHtml = '';

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
                innerHtml += ' onclick="Javascript:' + page_click + '(0);"';
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
                innerHtml += ' onclick="Javascript:' + page_click + '(-1);"';
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
                innerHtml += ' onclick="Javascript:' + page_click + '(' + val + ');"';
                innerHtml += '>';
                innerHtml += val;
                innerHtml += '</a>';

                innerHtml += '</li>';
            }
        }

    }

    $("#" + ctrl_id).html(innerHtml);
}

function onGetLogLevelNameFromLocal(ctrl_id, level_id) {
    var level_name = '';

    var log_elems = document.getElementById(ctrl_id);
    var log_items = log_elems.getElementsByClassName('flex-item');

    for(var idx = 0; idx < log_items.length; idx++) {
        var item = log_items[idx];
        var item_id = item.getAttribute('user-data-id');
        if (level_id == item_id) {
            level_name = item.getAttribute('user-data-name');
            return level_name;
        }
    }

    return level_name;
}

function onGetLogEventNameFromLocal(ctrl_id, event_id) {
    var event_name = '';

    var log_elems = document.getElementById(ctrl_id);
    var log_items = log_elems.getElementsByClassName('flex-item');

    for(var idx = 0; idx < log_items.length; idx++) {
        var item = log_items[idx];
        var item_id = item.getAttribute('user-data-id');
        if (event_id == item_id) {
            event_name = item.getAttribute('user-data-name');
            return event_name;
        }
    }

    return event_name;
}

function onGetSingleTableRowHtml(text) {
    var innerHtml = '';

    innerHtml += '<tr';
    innerHtml += '>';

    // 时间
    innerHtml += '<td';
    innerHtml += ' style="border: solid 0px white; background-color:white;"';
    innerHtml += '>';
    innerHtml += text
    innerHtml += '</td>';

    innerHtml += '</tr>';

    return innerHtml;
}

function onGetLogItemHtml(title, text) {
    var innerHtml = '';

    if (text == null) {
        text = '';
    }

    innerHtml += '<div';
    innerHtml += ' class="input-group"'
    innerHtml += '>';

    innerHtml += '<span';
    innerHtml += ' class="input-group-addon"';
    innerHtml += ' style="font-weight:bold; min-width: 110px; text-align:left;"';
    innerHtml += '>';
    innerHtml += title;
    innerHtml += '</span>';

    innerHtml += '<input';
    innerHtml += ' type="text"';
    innerHtml += ' class="form-control"';
    innerHtml += ' readonly="readonly"';
    innerHtml += ' value="' + text + '"';
    innerHtml += '>';

    innerHtml += '</div>';

    return innerHtml;
}

function onGetLogItemHtml2(title, rows, multi_text) {
    var innerHtml = '';

    if (multi_text == null) {
        multi_text = '';
    }

    innerHtml += '<div';
    innerHtml += ' class="input-group"'
    innerHtml += '>';

    innerHtml += '<span';
    innerHtml += ' class="input-group-addon"';
    innerHtml += ' style="font-weight:bold; min-width: 110px; text-align:left;"';
    innerHtml += '>';
    innerHtml += title;
    innerHtml += '</span>';

    innerHtml += '<textarea';
    innerHtml += ' class="form-control"';
    innerHtml += ' readonly="readonly"';
    innerHtml += ' rows="' + rows + '"';
    //innerHtml += ' style="border: solid 1px red;"';
    innerHtml += '>';
    innerHtml += multi_text;
    innerHtml += '</textarea>'

    innerHtml += '</div>';

    return innerHtml;
}

function onGetLogDetailText(detail) {
    var resData = {};

    var count = 0;
    var text = '';

    try {
        var obj = JSON.parse(detail);

        var time = obj.time;
        var position = obj.position;
        var user = obj.user;
        var name = obj.name;
        var target = obj.target;
        var event = obj.event;
        var result = obj.result;

        if (time != undefined && time) {
            text += '时间：' + time;
            count++;
        }

        if (user != undefined && user) {
            if (count > 0) {
                text += '\r\n';
            }
            text += '用户：' + user;
            count++;
        }

        if (position != undefined && position) {
            if (count > 0) {
                text += '\r\n';
            }
            text += '位置：' + position;
            count++;
        }

        if (name != undefined && name) {
            if (count > 0) {
                text += '\r\n';
            }
            text += '模块名称：' + name;
            count++;
        }

        if (target != undefined && target) {
            if (count > 0) {
                text += '\r\n';
            }
            text += '目标：' + target;
            count++;
        }

        if (event != undefined && event) {
            if (count > 0) {
                text += '\r\n';
            }
            text += '事件：' + event;
            count++;
        }

        if (result != undefined && result) {
            text += '结果：' + result;
            count++;
        }
    }
    catch (err) {
        //alert(err.message);
        // 用字符串方式解析
        var begin = detail.indexOf('{');
        var end = detail.lastIndexOf('}');
        if (begin >= 0 && begin < end) {
            var sub_arr = [];
            var parse_string = detail.substring(begin + 1, end);

            var pos1 = 0;
            var pos2 = -1;
            while((pos2 = parse_string.indexOf(',', pos1)) > pos1) {
                var sub_string = parse_string.substr(pos1, pos2 - pos1);

                sub_arr.push(sub_string);

                pos1 = pos2 + 1;
            }
            if (pos1 > 0) {
                var sub_string = parse_string.substr(pos1);

                sub_arr.push(sub_string);
            }

            text = '';
            count = 0;
            for(var idx = 0; idx < sub_arr.length; idx++) {
                var itemData = sub_arr[idx];

                var pos = itemData.indexOf(':', 0);
                if (pos <= 0) {
                    continue;
                }

                var sub_key = itemData.substr(0, pos);
                var sub_value = itemData.substr(pos + 1);

                sub_key = onTrim(sub_key, ' ');
                sub_key = onTrim(sub_key, '"');

                sub_value = onTrim(sub_value, ' ');
                sub_value = onTrim(sub_value, '"');

                var title = onGetKeyTitle(sub_key);
                if (title != undefined && title != '' && title.length > 0) {
                    if (count > 0) {
                        text += '\r\n';
                    }
                    text += title + ': ' + sub_value;
                    count++;
                }

            }
        }
    }

    resData['count'] = count;
    resData['data'] = text;

    return resData;
}

function onGetKeyTitle(key) {
    var title = '';

    switch(key) {
        case 'time':
            title = '时间';
            break;

        case 'position':
            title = '位置';
            break;

        case 'user':
            title = '用户';
            break;

        case 'event':
            title = '事件';
            break;

        case 'target':
            title = '目标';
            break;
    }

    return title;
}

function onTrim(str, sub_str) {
    var value = str;
    var pos = value.indexOf(sub_str);
    if (pos == 0) {
        value = value.substr(sub_str.length);
    }

    pos = value.lastIndexOf(sub_str);
    if (pos == (value.length - sub_str.length)) {
        value = value.substr(0, pos);
    }

    return value;
}