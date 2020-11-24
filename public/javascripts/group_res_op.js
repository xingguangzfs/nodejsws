/**
 * Created by fushou on 2019/3/13.
 */

function setItemAttrValue(item_id, attr_name, attr_value) {
    $("#" + item_id).attr(attr_name, attr_value);
}

function getItemAttrValue(item_id, attr_name) {
    return $("#" + item_id).attr(attr_name);
}

function onQueryNavGroups(ctrl_id, reqUrl, postData, group_type_text) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = "";
        var status = res['status'];
        var total_count = 0;
        if (status == 1) {
            total_count = res['total_count'];
        }

        innerHtml += '<a href="Javascript:void(0);" class="list-group-item active">';
        innerHtml += '<h4 class="list-group-item-heading">';
        innerHtml += group_type_text + '列表';
        innerHtml += '</h4>';
        innerHtml += '</a>';

        if (total_count > 0) {
            var list = res['list'];
            for (var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var item_id = itemData.id;
                var item_name = itemData.name;
                var item_remark = itemData.remark;

                // 自定义属性，用分号分隔
                var item_user_data = item_name + ';' + item_remark;
                var user_data_attr = 'id="' + item_id + '"'; // 用户ID
                user_data_attr += ' user-data="' + item_user_data + '"'; // 用户组ID

                // 资源类型
                var list_item_html = '<a href="Javscript:void(0);" class="list-group-item" ';
                list_item_html += user_data_attr;
                list_item_html += ' onclick="Javascript:onGroupItemClick(this);" ';
                list_item_html += '>';

                //list_item_html += '<p class="list-group-item-text">';
                list_item_html += item_name;
                //list_item_html += '</p>';

                list_item_html += '</a>';

                innerHtml += list_item_html;

            }
        }


        // 更新列表
        $("#" + ctrl_id).html(innerHtml);
    })

}

function onQueryGroupDetailDatas(ctrl_id, group_type_id, reqUrl, postData, enableAdd, input_type) {
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, function(res){
        var innerHtml = "";
        var status = res['status'];
        var total_count = 0;
        if (status == 1) {
            total_count = res['total_count'];
        }
        if (total_count > 0) {
            var list = res['list'];

            for(var idx = 0; idx < list.length; idx++) {
                var itemData = list[idx];

                var itemInnerHtml = onGenerateGroupDataHtml(group_type_id, itemData, input_type);

                innerHtml += itemInnerHtml;
            }
        }

        // 添加资源项
        if (enableAdd) {
            innerHtml += onGenerateAddDataHtml();
        }

        $("#" + ctrl_id).html(innerHtml);

    })

}

function onGenerateGroupDataHtml(group_type_id, itemData, input_type) {
    /*
     <div class="wrap-item">
     <div class="wrap-item-img">
     <img src="../images/user3.png">
     </div>
     <div class="wrap-item-text">
     div2
     </div>
     <div class="wrap-item-input">
     <input type="checkbox" name="inside" value="" />
     </div>
     </div>
     */
    var innerHtml = '';

    var item_id_head = '';
    var item_id = '';
    var item_text = '';
    var item_name = '';
    var item_img = '';
    var item_remark = '';

    var user_id = '';
    var user_name = '';
    var user_text = '';
    var user_image = '';
    var user_remark = '';

    item_remark = itemData.remark;

    user_id = itemData.id;

    if (group_type_id == 0) {
        // 用户
        item_id_head = 'user_';
        item_name = itemData.name;
        item_img = getDefaultUserImage();

        item_text = item_name;

        user_name = item_name;
    }
    else if (group_type_id == 1) {
        // 应用
        item_id_head = 'app_';
        item_img = getBaseUrl() + '/' + itemData.app_image;

        item_text = itemData.app_text;

        user_name = item_text;
        user_image = itemData.app_image;

    }
    else if (group_type_id == 2) {
        // 主机
        item_id_head = 'host_';
        item_name = itemData.name;
        item_img = getDefaultHostImage();

        var item_ip_addr = itemData.ip_addr;

        item_text = item_ip_addr;

        user_name = item_ip_addr;

    }
    item_id = item_id_head + itemData.id;

    user_text = item_text;
    if (user_text == undefined || user_text.length < 1) {
        user_text = user_name;
    }
    user_remark = item_remark;

    innerHtml += '<div class="wrap-item" ';
    innerHtml += 'id="' + item_id + '" ';
    innerHtml += 'user-id="' + user_id + '" ';
    innerHtml += 'user-name="' + user_name + '" ';
    innerHtml += 'user-text="' + user_text + '" ';
    innerHtml += 'user-image="' + user_image + '" ';
    innerHtml += 'user-remark="' + user_remark + '" ';
    innerHtml += '>';

    innerHtml += '<div class="wrap-item-img">';
    innerHtml += '<img src="' + item_img + '">';
    innerHtml += '</div>';

    innerHtml += '<div class="wrap-item-text">';
    innerHtml += item_text;
    innerHtml += '</div>';

    innerHtml += '<div class="wrap-item-input">';
    if (input_type == 'checkbox') {
        innerHtml += '<input type="checkbox" name="inside" value="" checked="checked" />';
    }
    else if (input_type == 'button') {
        innerHtml += '<input type="button" value="移除" onclick="Javascript:onRemoveItemClick(this);" />';
    }
    innerHtml += '</div>';

    innerHtml += '</div>';

    return innerHtml;
}

function onGenerateAddDataHtml() {
    var innerHtml = '';

    innerHtml += '<div class="wrap-item" onclick="Javascript:onResAddClick()";>';

    // 加号
    innerHtml += '<div class="add" >';
    innerHtml += '</div>';

    innerHtml += '</div>';

    return innerHtml;
}

