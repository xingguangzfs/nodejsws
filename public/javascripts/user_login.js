/**
 * Created by fushou on 2019/1/21.
 */

$(function(){
    $('#username').focus().blur(checkName);
    $('#password').blur(checkPassword);
});

function checkName(){
    var name = $('#username').val();
    if(name == null || name == ""){
        //提示错误
        $('#error-msg').html("用户名不能为空");
        return false;
    }
    var reg = /^\w{1,50}$/;
    if(!reg.test(name)){
        $('#error-msg').html("输入1-20个字母或数字或下划线");
        return false;
    }
    $('#error-msg').empty();
    return true;
}

function checkPassword(){
    var password = $('#password').val();
    if(password == null || password == ""){
        //提示错误
        $('#error-msg').html("密码不能为空");
        return false;
    }
    var reg = /^\w{3,50}$/;
    if(!reg.test(password)){
        $('#error-msg').html("输入3-50个字母或数字或下划线");
        return false;
    }
    $('#error-msg').empty();
    return true;
}
