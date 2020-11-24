/**
 * Created by fushou on 2019/9/19.
 */

function utilStrLen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}

function utilIsEmpty(str) {
    if (str == null || str == undefined || str == '' || str == {} || str.length < 1) {
        return true;
    }
    return false;
}

function utilOnReplace(str, oldKey, newKey) {
    // 字符串中所有旧字符串替换成新字符串
    return str.split(oldKey).join(newKey);
}

function utilMd5Encode(str, empyt_encode) {
    //return str;
    if (!empyt_encode) {
        if (str == undefined || str == null || str == '' || str.length < 1) {
            return '';
        }
    }
    return md5(str);
}

// 日期格式化
function utilFormatDate(diff_days) {
    /*
    *  var o = {
     "M+": this.getMonth() + 1, //月份
     "d+": this.getDate(), //日
     "h+": this.getHours(), //小时
     "m+": this.getMinutes(), //分
     "s+": this.getSeconds(), //秒
     "q+": Math.floor((this.getMonth() + 3) / 3), //季度
     "S": this.getMilliseconds() //毫秒
     };
    * */
    var ct = new Date(); // 当前时间
    ct.setDate(ct.getDate() - diff_days);

    var year = ct.getFullYear();
    var mon =ct.getMonth() + 1;
    var day = ct.getDate();

    var fmt = year + '-' + mon + '-' + day;
    return fmt;
}

function utilGetDateFromDateTimeString(tm) {
    var dt_arr = tm.split(' ');
    if (dt_arr && dt_arr.length > 1) {
        return dt_arr[0];
    }
    return '';
}

function utilGetFileName(full_file) {
    var file_name = '';

    var sp_ch1 = '\\';
    var sp_ch2 = '/';

    var pos = full_file.lastIndexOf(sp_ch1);
    if (pos < 0) {
        pos = full_file.lastIndexOf(sp_ch2);
    }

    if (pos < 0) {
        return full_file;
    }

    var file_name = full_file.substr(pos + 1);
    pos = file_name.indexOf('.');
    if (pos > 0) {
        file_name = file_name.substr(0, pos);
    }

    return file_name;
}

function utilSetInputAttr(id, key, val) {
    $("#" + id).attr(key, val);
}

function utilSetInputValue(id, val) {
    utilSetInputAttr(id, 'value', val);
}

function utilGetInputAttr(id, key) {
    return $("#" + id).attr(key);
}

function utilGetInputValue(id) {
    return $("#" + id).val();
}