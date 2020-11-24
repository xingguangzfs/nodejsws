/**
 * Created by fushou on 2019/4/29.
 */

// 存储为全局变量
// 判断角色是否为管理员
function isAdministrator(role) {
    if (role == 'administrator') {
        return true;
    }
    return false;
}

// 返回管理员的本地存储KEY值，因为目前只有一个管理员，所以可以这样处理
function getAdministratorUserInfoKey() {
    return 'administrator';
}

function setAdministratorUserInfo(value) {
    setLocalStorage(getAdministratorUserInfoKey(), value);
}

function getAdministratorUserInfo() {
    return getLocalStorage(getAdministratorUserInfoKey());
}

function getAdministratorUserInfoObj() {
    var user_info = getAdministratorUserInfo();
    if (user_info == undefined || user_info == null || user_info == '') {
        return null;
    }
    var obj = null;
    try {
        obj = JSON.parse(user_info);
    }
    catch(err) {
        obj = null;
    }
    return obj;
}

function getAdministratorId() {
    var user_info = getAdministratorUserInfoObj();
    if (user_info == null) {
        return '';
    }
    return user_info.id;
}

function getAdministratorName() {
    var user_info = getAdministratorUserInfoObj();
    if (user_info == null) {
        return '';
    }
    return user_info.name;
}

// 设置普通用户本地存储
// 说明：key/value必须是字符串
function setUserInfo(key, value) {
    setLocalStorage(key, value);
}

function getUserInfo(key) {
    if (key == undefined || key == null || key == '') {
        return null;
    }
    return getLocalStorage(key);
}

function getUserInfoObj(key) {
    var userInfo = getUserInfo(key);
    if (userInfo == null) {
        return null;
    }
    var obj = null;
    try {
        obj = JSON.parse(userInfo);
    }
    catch (err) {
        obj = null;
    }
    return obj;
}

function getToken(user_name) {
    var userInfo = null;
    if (user_name == undefined || user_name == null || user_name == '') {
        // 默认取管理员
        userInfo = getUserInfo(getAdministratorName());
    }
    else {
        userInfo = getUserInfo(user_name);
    }
    if (userInfo == undefined || userInfo == null || userInfo == '') {
        return null;
    }
    var token = '';
    try {
        var obj = JSON.parse(userInfo);
        token = obj.token;
    }
    catch(err) {

    }
    return token;
}

function getPageUserId() {
    return $("#private_user_id").val();
}

function setPageUserId(id) {
    $("#private_user_id").attr('value', id);
}

function getPageUserName() {
    return $("#private_user_name").val();
}

function setPageUserName(user_name) {
    $("#private_user_name").attr('value', user_name);
}

function setPageLicense(license) {
    $("#private_license").attr('value', license);
}

function getPageLicense() {
    return $("#private_license").val();
}

function getPageLoginStatus() {
    return $("#private_login_status").val();
}

function setPageLoginStatus(status) {
    $("#private_login_status").attr('value', status);
}

function getPageUserRole() {
    return $("#private_user_role").val();
}

function setPageUserRole(role) {
    $("#private_user_role").attr('value', role);
}

function getHttpTokenHead(token_key) {
    var token = getToken(token_key);
    // 认证token
    var reqAuthor = "Bearer " + token;

    var resData = {
        Accept: "application/json; charset=utf-8",
        Authorization: reqAuthor
    }

    return resData;
}

function removeUserInfo(user_name) {
    if (user_name == undefined || user_name == null || user_name == '') {
        return;
    }
    removeLocalStorage(user_name);
}

// 重定向页面
function redirectTo(reqUrl, model) {
    var location = null;
    if (model == 'top') {
        // 最外层页面跳转
        location = top.location;
    }
    else if (model == 'parent') {
        // 父页面跳转
        location = parent.location;
    }
    else {
        // 本页面跳转
        location = window.location;
    }

    if (location != null) {
        //location.href = reqUrl;
        location.replace(reqUrl);
    }
}

// 重新登录
function redirectToLogin() {
    var reqUrl = getBaseUrl() + '/login.html';
    redirectTo(reqUrl, 'top');
}

// 用户注销
function onLogout(user_name) {
    var user_info = getUserInfoObj(user_name);
    if (user_info == null) {
        return;
    }

    var reqUrl = getBaseUrl() + '/logout';

    var postData = {
        id: user_info.id,
        name: user_info.name,
        token: user_info.token
    }

    httpPostRequest(reqUrl, user_name, postData, function(res) {
        var status = res['status'];
        if (status == 1) {
            removeUserInfo(user_name);
        }
    })
}

// onErrorHandle : 常规错误处理，通常是自定义错误
function onErrorHandle(errorno, message) {
    if (errorno == 1) {
        // 常规错误
        alert(message);
    }
    else if (errorno == 2) {
        // 重复登录错误
        // 旧token已经失效，直接跳转就好，不需要再注销，因为登录会话信息已经是最新的了
        alert(message);

        redirectToLogin();
    }
    else {
        alert(message);
    }
}

// onSysErrorHandle : 系统错误处理，通常是HTTP错误
function onSysErrorHandle(err) {
    var status = err.status;

    if (status == 401) {
        var user_name = '';

        // 尝试在页面中获取用户名，如果获取不到再尝试获取管理员名称
        user_name = getPageUserName();
        if (user_name == null || user_name == undefined || user_name == '' || user_name.length < 1) {
            user_name = getAdministratorName();
        }
        var user_info = getUserInfo(user_name);
        if (user_info != undefined && user_info != null) {
            alert('本次会话已超时，请重新登录');
        }
        else {
            return;
        }
        // 退出之前登录
        onLogout(user_name);
        var logout_timer = setTimeout(function(){
            // 重新登录
            redirectToLogin();
            clearTimeout(logout_timer);
            logout_timer = null;
        }, 1000);
    }
    else {
        //var msg = "HTTP " + status + " 错误";
        //alert(JSON.stringify(msg));
    }
}

function httpGetRequest(reqUrl, user_name, okcallback) {
    $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: getHttpTokenHead(user_name),
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: '',
        success: okcallback,
        error: function(err) {
            onSysErrorHandle(err);
        }
    });
}

function httpGetRequest2(reqUrl, user_name, okcallback, failcallback){
    $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: getHttpTokenHead(user_name),
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: '',
        success: okcallback,
        error: failcallback
    });
}

function httpPostRequest(reqUrl, user_name, postData, okcallback) {
    $.ajax({
        url: reqUrl,
        type: 'POST',
        headers: getHttpTokenHead(user_name),
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(postData),
        success: okcallback,
        error: function(err) {
            onSysErrorHandle(err);
        }
    });
}

function httpPostRequest2(reqUrl, user_name, postData, okcallback, failcallback) {
    var reqHeaders = getHttpTokenHead(user_name);

    $.ajax({
        url: reqUrl,
        type: 'POST',
        headers: reqHeaders,
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(postData),
        success: okcallback,
        error: failcallback
    });
}

function httpGetNoTokenRequest(reqUrl, okcallback) {
    $.ajax({
        url: reqUrl,
        type: 'GET',
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: '',
        success: okcallback,
        error: function(err) {
            onSysErrorHandle(err);
        }
    });
}

function httpGetNoTokenRequest2(reqUrl, okcallback, failcallback){
    $.ajax({
        url: reqUrl,
        type: 'GET',
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: '',
        success: okcallback,
        error: failcallback
    });
}

function httpPostNoTokenRequest(reqUrl, postData, okcallback) {
    $.ajax({
        url: reqUrl,
        type: 'POST',
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(postData),
        success: okcallback,
        error: function(err) {
            onSysErrorHandle(err);
        }
    });
}

function httpPostNoTokenRequest2(reqUrl, postData, okcallback, failcallback) {
    $.ajax({
        url: reqUrl,
        type: 'POST',
        async: false,
        cache: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(postData),
        success: okcallback,
        error: failcallback
    });
}

// httpPostNoTokenRequest3 : 主要用于表单数据的提交请求
function httpPostNoTokenRequest3(reqUrl, formData, okcallback) {
    $.ajax({
        url: reqUrl,
        type: 'POST',
        dataType: "json",//预期服务器返回的数据类型
        data: formData,
        success: okcallback,
        error: function(err) {
            onSysErrorHandle(err);
        }
    });
}
