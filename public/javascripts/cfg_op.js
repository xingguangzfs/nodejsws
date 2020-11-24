/**
 * Created by fushou on 2019/11/12.
 */

function onGetAccessListHtml(access_ids, access_list, default_checked) {
    var access_ids_obj = null;
    try {
        if (access_ids) {
            access_ids_obj = JSON.parse(access_ids);
        }
    }
    catch(err) {
        access_ids_obj = null;
    }

    var innerHtml = '<div class="option-row">';

    if (access_list != undefined && access_list != null && access_list.length > 0) {
        for(var idx = 0; idx < access_list.length; idx++) {
            var itemData = access_list[idx];

            var item_id = itemData.id;
            var item_name = itemData.name;
            var item_title = itemData.title;

            var is_exist = onAccessIsExisted(item_id, access_ids_obj);
            var check_value = is_exist ? 1 : 0;

            innerHtml += '<div class="option-row-item" ';
            innerHtml += 'access_id="' + item_id + '" ';
            innerHtml += 'access_name="' + item_name + '" ';
            innerHtml += 'access_title="' + item_title + '" ';
            innerHtml += '>';

            innerHtml += '<input type="checkbox" ';
            innerHtml += 'name="access_flag" ';
            if (default_checked || check_value) {
                innerHtml += 'checked="checked" ';
            }
            innerHtml += '>&nbsp;&nbsp;';
            innerHtml += item_title;

            innerHtml += '</div>';
        }
    }

    innerHtml += '</div>';

    return innerHtml;
}

function onAccessIsExisted(access_id, acces_ids) {
    if (access_id == undefined || access_id == null) {
        return false;
    }

    if (acces_ids == undefined || acces_ids == null || acces_ids.length == 0) {
        return false;
    }

    for(var idx = 0; idx < acces_ids.length; idx++) {
        var itemValue = acces_ids[idx];
        if (access_id == itemValue) {
            return true;
        }
    }

    return false;
}

function onGetUserAccessCheckedData(rootElem) {
    var checkboxElems = rootElem.getElementsByClassName('option-row-item');
    var access_count = checkboxElems.length;

    var access_ids = [];

    for(var idx = 0; idx < access_count; idx++) {
        var opElem = checkboxElems[idx];

        var access_id = opElem.getAttribute('access_id');
        var access_name = opElem.getAttribute('access_name');
        var access_title = opElem.getAttribute('access_title');

        var inputElem = opElem.childNodes[0];
        var input_checked = inputElem.checked;

        if (input_checked) {
            access_ids.push(access_id);
        }
    }

    var local_access_ids = access_ids.length > 0 ? access_ids : null;

    return local_access_ids;
}