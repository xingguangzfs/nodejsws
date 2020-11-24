/**
 * Created by fushou on 2019/7/5.
 */

function IsEmpty(param) {
    if (param == undefined || param == null || param == '' || param=={})
        return true;
    if (typeof(param) == "string" && param.toString() == "") {
        return true;
    }
    if (typeof (param) == "object" && param == {}) {
        return true;
    }
    return false;
}

function setItemAttrValue(id, name, value) {
    document.getElementById(id).setAttribute(name, value);
}

function getItemAttrValue(id, name) {
    return document.getElementById(id).getAttribute(name);
}

function onGetPlaceText() {
    var e = window.event;
    var win_width = $(window).width();
    var mouse_x = e.pageX;
    var mouse_y = e.pageY;
    var place_x = (win_width - mouse_x);
    var place_text = (place_x <= 300) ? 'left' : 'right';

    return place_text;
}

function onGetStatusText(status) {
    if (status > 0) {
        return '是';
    }
    return '否';
}

function onGetStaticAppIconPath() {
    return getBaseUrl() + '/static/appicon';
}

function onGetGradeNetPath() {
    return getBaseUrl() + '/images';
}

function onGetGradePrefix() {
    return 'circle_';
}

function onGetGradeSuffix() {
    return '.png';
}

function onGetSwitchGrade(status) {
    var grade = 'black';
    if (status > 0) {
        grade = 'green';
    }
    return grade;
}

function onGetGrade(status, users, cores) {
    var user_cores = $("#private_user_cores").val();
    if (user_cores <= 0 ) {
        user_cores = 1;
    }
    // 主机负载程度值
    // ['green', 'orange', 'gules', 'black']

    var grade = 'black';

    if (status == 0 || cores == 0) {
        grade = 'black';
        return grade;
    }

    if (users < 1) {
        grade = 'green';
    }
    else {
        var used_cores = user_cores * users;

        var level1 = 5 * cores / 10; // 50%
        var level2 = cores; // 100%

        if (used_cores < level1) {
            grade = 'green';
        }
        else if (used_cores < level2) {
            grade = 'orange';
        }
        else {
            grade = 'gules';
        }
    }

    return grade;
}

function onGetGradeImgId(id) {
    return ('grade_img_' + id);
}

function onGetDefaultModuleId(type) {
    switch(type) {
        case 'mon_user': {
            return 1;
        }break;
        case 'mon_host': {
            return 2;
        }break;
        case 'mon_app': {
            return 3;
        }break;
    }

    return 0;
}

function onGetMonUserCmdId() {
    return 20;
}

function onGetMonUserRespCmdId() {
    return 8020;
}

function onGetMonHostCmdId() {
    return 21;
}

function onGetMonHostRespCmdId() {
    return 8021;
}

function onGetMonAppCmdId() {
    return 22;
}

function onGetMonAppRespCmdId() {
    return 8022;
}

function onGetNormalDataPacket(cmdid, id, errno, errmsg, status, data) {
    var resData = {};

    resData['cmdid'] = cmdid;
    resData['id'] = id;
    resData['errno'] = errno;
    resData['errmsg'] = errmsg;
    resData['status'] = status;

    if (IsEmpty(data)) {
        resData['data'] = null;
    }
    else {
        resData['data'] = data;
    }

    return resData;
}

// onGetMonUserPacket : 获取监控用户请求包
function onGetMonUserPacket(module_id, status, user_data) {
    var resData = onGetNormalDataPacket(onGetMonUserCmdId(), module_id, 0, '', status, user_data);
    return resData;
}

// onGetMonHostPacket : 获取监控主机请求包
function onGetMonHostPacket(module_id, status, user_data) {
    var resData = onGetNormalDataPacket(onGetMonHostCmdId(), module_id, 0, '', status, user_data);
    return resData;
}

// onGetMonAppPacket : 获取监控应用请求包
function onGetMonAppPacket(module_id, status, user_data) {
    var resData = onGetNormalDataPacket(onGetMonAppCmdId(), module_id, 0, '', status, user_data);
    return resData;
}

function onParseMonRecvData(resPacket, callback) {

    var cmdid = resPacket['cmdid'];

    var datas = null;

    switch(cmdid) {
        // 用户监控应答
        case onGetMonUserRespCmdId(): {
            var list = resPacket['list'];
            if (list != undefined && list != null) {
                datas = list;
            }
        }break;

        // 主机监控应答
        case onGetMonHostRespCmdId(): {
            var list = resPacket['list'];
            if (list != undefined && list != null) {
                datas = list;
            }
        }break;

        // 应用监控应答
        case onGetMonAppRespCmdId(): {
            var list = resPacket['list'];
            if (list != undefined && list != null) {
                datas = list;
            }
        }break;
    }

    if (datas != null && callback) {
        callback(datas);
    }
}

function onGetMonServerHost() {
    //return window.location.host;
    var host = window.location.host; // 如果端口不为80则默认会带上端口号

    var ht = '';
    var hostarr = host.split(':');
    if (hostarr.length > 0) {
        ht = hostarr[0];
    }
    else {
        ht = host;
    }
    return ht;
}

function onGetMonServerAddr(callback) {
    var reqUrl = getBaseUrl() + '/mon/websocket_addr_query';

    var user_name = getAdministratorName();

    var postData = {
        time: new Date().getTime()
    }

    httpPostRequest(reqUrl, user_name, postData, callback);
}

function onGetMonPeriod(callback) {
    var reqUrl = getBaseUrl() + '/cfg/ws';

    var user_name = getAdministratorName();

    var postData = {
        fields: ['mon_period']
    }

    httpPostRequest(reqUrl, user_name, postData, callback);
}