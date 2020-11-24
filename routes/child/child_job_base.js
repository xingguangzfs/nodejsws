/**
 * Created by fushou on 2019/12/10.
 */

function onCombineDateTime(year, month, day, hours, minute, second) {
    //var str = year + '-' + month + '-' + day + ' ' + hours + ':' + minute + ':' + second;
    var str = year;
    str += '-';

    if (month < 10) {
        str += '0';
    }
    str += month;
    str += '-';

    if (day < 10) {
        str += '0';
    }
    str += day;
    str += ' ';

    str += hours;
    str += ':';

    str += minute;
    str += ':';

    str += second;

    return str;
}

function onDataIsExist(data_list, begin_tm, end_tm) {
    if (data_list == undefined || data_list == null || data_list.length == 0) {
        return 0;
    }

    for(var idx = 0; idx < data_list.length; idx++) {
        var itemData = data_list[idx];

        var item_begin_tm = itemData['begin_tm'];
        var item_end_tm = itemData['end_tm'];

        if (begin_tm == item_begin_tm && end_tm == item_end_tm) {
            return 1;
        }
    }

    return 0;
}

// onGetFrontMonthDays : 根据当前年和月，计算前面月份的天数之和
// param: cur_year指定当前的年
// param: cur_month指定当前的月
// param: front_months指定之前的月份个数
function onGetFrontMonthDays(cur_year, cur_month, cur_day, front_month_count) {
    var dt_param = cur_year + '/' + cur_month + '/' + cur_day;
    var last_dt = new Date(dt_param);

    var front_year = cur_year;
    var front_month = cur_month;
    var front_day = cur_day;

    var temp_front_month = front_month_count;

    while(temp_front_month > 0) {
        if (temp_front_month >= 12) {
            front_year -= 1;
            temp_front_month -= 12;
        }
        else {
            if (temp_front_month < front_month) {
                front_month -= temp_front_month;
            }
            else {
                front_year -= 1;
                front_month = 12 + front_month - temp_front_month;
            }
            break;
        }
    }

    var dt_front_fmt = front_year + '/' + front_month + '/' + front_day;
    var front_dt = new Date(dt_front_fmt);

    var last_dt_times = last_dt.getTime(); // 单位毫秒
    var front_dt_times = front_dt.getTime();
    var sub_seconds = (last_dt_times - front_dt_times) / 1000; // 转化为秒单位
    var diff_day = parseInt(sub_seconds / (24 * 60 * 60)); // 计算天数

    // 不包括当天
    return (diff_day - 1);
}

// onGetMonthDays : 获取指定月份的天数
function onGetMonthDays(year, month) {
    var days = 0;
    var is_leap_year = (year % 4 == 0 ? 1 : 0);

    switch(month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12: {
            days = 31;
        }break;

        case 2:
        {
            if (is_leap_year) {
                days = 29;
            }
            else {
                days = 28;
            }
        }break;
        case 4:
        case 6:
        case 9:
        case 11:
        {
            days = 30;
        }break;
    }

    return days;
}

// onIsMonthEnd : 根据输入的日期判断是否为月份最后一天
module.exports.onIsMonthEnd = function(year, month, day) {
    // 判断是否为闰年
    var is_leap_year = (year % 4 == 0 ? 1 : 0);
    var is_end = 0;

    switch(month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
        {
            is_end = (day == 31 ? 1 : 0);
        }break;
        case 2:
        {
            if (is_leap_year) {
                is_end = (day == 29 ? 1 : 0);
            }
            else {
                is_end = (day == 28 ? 1 : 0);
            }
        }break;
        case 4:
        case 6:
        case 9:
        case 11:
        {
            is_end = (day == 30 ? 1 : 0);
        }break;
    }

    return is_end;
}

// onFilterData
module.exports.onCalculateUpdateData = function(statis_datas, begin_tm, end_tm, interval_days) {
    var ret_datas = [];

    var dt = new Date(begin_tm);
    var dt2 = new Date(end_tm);
    var diff_tm = (dt2.getTime() - dt.getTime()) / 1000; // 计算相差秒数
    if (diff_tm <= 0) {
        return ret_datas;
    }

    var diff_day = parseInt(diff_tm / (24 * 60 * 60)); // 相差天数
    for(var idx = 0; idx <= diff_day; idx += interval_days) {
        var dt_year = dt.getFullYear();
        var dt_month = dt.getMonth() + 1;
        var dt_day = dt.getDate();

        var end_dt = new Date(dt);
        if (interval_days > 1) {
            end_dt.setDate(end_dt.getDate() + interval_days - 1);
        }
        var end_dt_year = end_dt.getFullYear();
        var end_dt_month = end_dt.getMonth() + 1;
        var end_dt_day = end_dt.getDate();

        var dt_begin_tm = onCombineDateTime(dt_year, dt_month, dt_day, '00', '00', '00');
        var dt_end_tm = onCombineDateTime(end_dt_year, end_dt_month, end_dt_day, '23', '59', '59');

        if (onDataIsExist(statis_datas, dt_begin_tm, dt_end_tm)) {
            continue;
        }

        var ret_item = {};
        ret_item['begin_tm'] = dt_begin_tm;
        ret_item['end_tm'] = dt_end_tm;

        ret_datas.push(ret_item);

        // 往后加一天
        dt.setDate(dt.getDate() + interval_days);
    }

    return ret_datas;
}

module.exports.onCalculateUpdateDataMonth = function(statis_datas, begin_tm, end_tm) {
    var ret_datas = [];

    var dt = new Date(begin_tm);
    var dt2 = new Date(end_tm);
    var diff_tm = (dt2.getTime() - dt.getTime()) / 1000; // 计算相差秒数
    if (diff_tm <= 0) {
        return ret_datas;
    }

    var diff_day = parseInt(diff_tm / (24 * 60 * 60)); // 相差天数

    if (diff_day < 28) {
        // 时间不足一个月
        return ret_datas;
    }

    var begin_year = dt.getFullYear();
    var begin_month = dt.getMonth() + 1;

    var temp_year = begin_year;
    var temp_month = begin_month;

    var days = 0;
    while(days < diff_day) {
        var month_days = onGetMonthDays(temp_year, temp_month);

        var dt_year = temp_year;
        var dt_month = temp_month;

        var dt_begin_tm = onCombineDateTime(dt_year, dt_month, 1, '00', '00', '00');
        var dt_end_tm = onCombineDateTime(dt_year, dt_month, month_days, '23', '59', '59');

        var ret_item = {};
        ret_item['begin_tm'] = dt_begin_tm;
        ret_item['end_tm'] = dt_end_tm;

        ret_datas.push(ret_item);

        // 往后推一个月
        if (temp_month == 12) {
            temp_year += 1;
            temp_month = 1;
        }
        else {
            temp_month += 1;
        }

        days += month_days;
    }

    return ret_datas;
}

module.exports.onCalculateUpdateDataQuarter = function(statis_datas, begin_tm, end_tm) {
    var ret_datas = [];

    var dt = new Date(begin_tm);
    var dt2 = new Date(end_tm);
    var diff_tm = (dt2.getTime() - dt.getTime()) / 1000; // 计算相关秒数
    if (diff_tm <= 0) {
        return ret_datas;
    }

    var diff_day = parseInt(diff_tm / (24 * 60 * 60)); // 相差天数
    if (diff_day < 90) {
        // 一个季度最少有90天
        return ret_datas;
    }

    // 如果已经存在，则不再更新
    for(var idx = 0; idx < statis_datas.length; idx++) {
        var itemData = statis_datas[idx];

        var item_begin_tm = itemData['begin_tm'];
        var item_end_tm = itemData['end_tm'];

        if (begin_tm == item_begin_tm && end_tm == item_end_tm) {
            return [];
        }
    }

    var ret_item = {};
    ret_item['begin_tm'] = begin_tm;
    ret_item['end_tm'] = end_tm;

    ret_datas.push(ret_item);

    return ret_datas;
}

module.exports.onCalculateUpdateDataHalfYear = function(statis_datas, begin_tm, end_tm) {
    var ret_datas = [];

    var dt = new Date(begin_tm);
    var dt2 = new Date(end_tm);
    var diff_tm = (dt2.getTime() - dt.getTime()) / 1000; // 计算相关秒数
    if (diff_tm <= 0) {
        return ret_datas;
    }

    var diff_day = parseInt(diff_tm / (24 * 60 * 60)); // 相差天数
    if (diff_day < 180) {
        // 半年天数
        return ret_datas;
    }

    // 如果已经存在，则不再更新
    for(var idx = 0; idx < statis_datas.length; idx++) {
        var itemData = statis_datas[idx];

        var item_begin_tm = itemData['begin_tm'];
        var item_end_tm = itemData['end_tm'];

        if (begin_tm == item_begin_tm && end_tm == item_end_tm) {
            return [];
        }
    }

    var ret_item = {};
    ret_item['begin_tm'] = begin_tm;
    ret_item['end_tm'] = end_tm;

    ret_datas.push(ret_item);

    return ret_datas;
}

module.exports.onCalculateUpdateDataYear = function(statis_datas, begin_tm, end_tm) {
    var ret_datas = [];

    var dt = new Date(begin_tm);
    var dt2 = new Date(end_tm);
    var diff_tm = (dt2.getTime() - dt.getTime()) / 1000; // 计算相关秒数
    if (diff_tm <= 0) {
        return ret_datas;
    }

    var diff_day = parseInt(diff_tm / (24 * 60 * 60)); // 相差天数
    if (diff_day < 364) {
        // 年天数
        return ret_datas;
    }

    // 如果已经存在，则不再更新
    for(var idx = 0; idx < statis_datas.length; idx++) {
        var itemData = statis_datas[idx];

        var item_begin_tm = itemData['begin_tm'];
        var item_end_tm = itemData['end_tm'];

        if (begin_tm == item_begin_tm && end_tm == item_end_tm) {
            return [];
        }
    }

    var ret_item = {};
    ret_item['begin_tm'] = begin_tm;
    ret_item['end_tm'] = end_tm;

    ret_datas.push(ret_item);

    return ret_datas;
}

// getTimeWhereSql : 获取指定时间段SQL条件语句
module.exports.getBetweenTime = function(last_days) {
    var retTime = {};
    var dt = new Date();


    if (last_days == 0) {
        // 当天
        var dt_year = dt.getFullYear();
        var dt_month = dt.getMonth() + 1;
        var dt_day = dt.getDate();

        var begin_tm = onCombineDateTime(dt_year, dt_month, dt_day, '00', '00', '00');
        var end_tm = onCombineDateTime(dt_year, dt_month, dt_day, '23', '59', '59');

        retTime['begin_tm'] = begin_tm;
        retTime['end_tm'] = end_tm;
    }
    else {
        // 前一天
        var last_dt = new Date(dt.setDate(dt.getDate() - 1));

        // 前N天
        var temp_dt = new Date(last_dt);
        var front_dt = new Date(temp_dt.setDate(temp_dt.getDate() - last_days + 1));

        var end_dt_year = last_dt.getFullYear();
        var end_dt_month = last_dt.getMonth() + 1;
        var end_dt_day = last_dt.getDate();

        var begin_dt_year = front_dt.getFullYear();
        var begin_dt_month = front_dt.getMonth() + 1;
        var begin_dt_day = front_dt.getDate();

        var begin_tm = onCombineDateTime(begin_dt_year, begin_dt_month, begin_dt_day, '00', '00', '00');
        var end_tm = onCombineDateTime(end_dt_year, end_dt_month, end_dt_day, '23', '59', '59');

        retTime['begin_tm'] = begin_tm;
        retTime['end_tm'] = end_tm;
    }

    return retTime;
}

// getBetweenWeekTime : 获取周周期时间
module.exports.getBetweenWeekTime = function(last_weeks) {
    var retTime = {};
    var dt = new Date();

    var cur_week_days = dt.getDay(); // 星期天为 0, 星期一为 1, 以此类推

    var front_dt = null;
    var last_dt = null;

    // 计算终止时间
    if (cur_week_days == 0) {
        // 刚好周日
        last_dt = dt;
    }
    else {
        last_dt = new Date(dt.setDate(dt.getDate() - cur_week_days));
    }

    // 定位到周一
    var temp_dt = new Date(last_dt);
    if (last_weeks == 0) {
        // 最后一周
        front_dt = new Date(temp_dt.setDate(temp_dt.getDate() - 6));
    }
    else {
        front_dt = new Date(temp_dt.setDate(temp_dt.getDate() - last_weeks * 7 + 1))
    }

    // 组合时间
    var end_dt_year = last_dt.getFullYear();
    var end_dt_month = last_dt.getMonth() + 1;
    var end_dt_day = last_dt.getDate();

    var begin_dt_year = front_dt.getFullYear();
    var begin_dt_month = front_dt.getMonth() + 1;
    var begin_dt_day = front_dt.getDate();

    var begin_tm = onCombineDateTime(begin_dt_year, begin_dt_month, begin_dt_day, '00', '00', '00');
    var end_tm = onCombineDateTime(end_dt_year, end_dt_month, end_dt_day, '23', '59', '59');

    retTime['begin_tm'] = begin_tm;
    retTime['end_tm'] = end_tm;

    return retTime;
}

// getBetweenMonthTime : 获取月周期时间
module.exports.getBetweenMonthTime = function(last_months) {
    var retTime = {};
    var dt = new Date();

    // 当前日期
    var cur_year = dt.getFullYear();
    var cur_month = dt.getMonth() + 1;
    var cur_days = dt.getDate();

    var front_dt = null;
    var last_dt = null;

    // 计算终止时间
    if (this.onIsMonthEnd(cur_year, cur_month, cur_days)) {
        // 刚好周日
        last_dt = dt;
    }
    else {
        last_dt = new Date(dt.setDate(dt.getDate() - cur_days));
    }

    var last_month_days = 0;
    var temp_dt = new Date(last_dt);
    if (last_months == 0) {
        // 最后一个月
        last_month_days = onGetFrontMonthDays(cur_year, cur_month, cur_days, 1);
    }
    else {
        last_month_days = onGetFrontMonthDays(cur_year, cur_month, cur_days, last_months);
    }

    front_dt = new Date(temp_dt.setDate(temp_dt.getDate() - last_month_days));

    // 组合时间
    var end_dt_year = last_dt.getFullYear();
    var end_dt_month = last_dt.getMonth() + 1;
    var end_dt_day = last_dt.getDate();

    var begin_dt_year = front_dt.getFullYear();
    var begin_dt_month = front_dt.getMonth() + 1;
    var begin_dt_day = front_dt.getDate();

    var begin_tm = onCombineDateTime(begin_dt_year, begin_dt_month, begin_dt_day, '00', '00', '00');
    var end_tm = onCombineDateTime(end_dt_year, end_dt_month, end_dt_day, '23', '59', '59');

    retTime['begin_tm'] = begin_tm;
    retTime['end_tm'] = end_tm;

    return retTime;
}

// getBetweenQuarterTime : 获取季度时间范围
module.exports.getBetweenQuarterTime = function() {
    var retTime = {};
    var dt = new Date();

    // 当前日期
    var cur_year = dt.getFullYear();
    var cur_month = dt.getMonth() + 1;
    var cur_days = dt.getDate();

    var front_year = 0, front_month = 0, front_day = 0;
    var last_year = 0, last_month = 0, last_day = 0;

    front_day = 1;
    if (cur_month < 3 || (cur_month == 3 && cur_days < 31)) {
        // 去年第四季度
        front_year = cur_year - 1;
        front_month = 10;
        //front_day = 1;

        last_year = cur_year - 1;
        last_month = 12;
        last_day = 31;
    }
    else if (cur_month < 6 || (cur_month == 6 && cur_days < 30)) {
        // 今年第一季度
        front_year = cur_year;
        front_month = 1;
        //front_day = 1;

        last_year = cur_year;
        last_month = 3;
        last_day = 31;
    }
    else if (cur_month < 9 || (cur_month == 9 && cur_days < 30)) {
        // 今年第二季度
        front_year = cur_year;
        front_month = 4;
        //front_day = 1;

        last_year = cur_year;
        last_month = 6;
        last_day = 30;
    }
    else if (cur_month < 12 || (cur_month == 12 && cur_days < 31)) {
        // 今年第三季度
        front_year = cur_year;
        front_month = 7;
        front_day = 1;

        last_year = cur_year;
        last_month = 9;
        last_day = 30;
    }
    else {
        // 今年第四季度
        front_year = cur_year;
        front_month = 10;
        front_day = 1;

        last_year = cur_year;
        last_month = 12;
        last_day = 31;
    }

    var begin_tm = onCombineDateTime(front_year, front_month, front_day, '00', '00', '00');
    var end_tm = onCombineDateTime(last_year, last_month, last_day, '23', '59', '59');

    retTime['begin_tm'] = begin_tm;
    retTime['end_tm'] = end_tm;

    return retTime;
}

module.exports.getBetweenHalfYearTime = function() {
    var retTime = {};
    var dt = new Date();

    // 当前日期
    var cur_year = dt.getFullYear();
    var cur_month = dt.getMonth() + 1;
    var cur_days = dt.getDate();

    var front_year = 0, front_month = 0, front_day = 0;
    var last_year = 0, last_month = 0, last_day = 0;

    if (cur_month < 6 || (cur_month == 6 && cur_days < 30)) {
        // 去年下半年
        front_year = cur_year - 1;
        front_month = 7;
        front_day = 1;

        last_year = cur_year - 1;
        last_month = 12;
        last_day = 31;
    }
    else if (cur_month < 12 || (cur_month == 12 && cur_days < 31)) {
        // 今年上半年
        front_year = cur_year;
        front_month = 1;
        front_day = 1;

        last_year = cur_year;
        last_month = 6;
        last_day = 30;
    }
    else {
        // 今年下半年
        front_year = cur_year;
        front_month = 7;
        front_day = 1;

        last_year = cur_year;
        last_month = 12;
        last_day = 31;
    }

    var begin_tm = onCombineDateTime(front_year, front_month, front_day, '00', '00', '00');
    var end_tm = onCombineDateTime(last_year, last_month, last_day, '23', '59', '59');

    retTime['begin_tm'] = begin_tm;
    retTime['end_tm'] = end_tm;

    return retTime;
}

module.exports.getBetweenYearTime = function() {
    var retTime = {};
    var dt = new Date();

    // 当前日期
    var cur_year = dt.getFullYear();
    var cur_month = dt.getMonth() + 1;
    var cur_days = dt.getDate();

    var front_year = 0, front_month = 0, front_day = 0;
    var last_year = 0, last_month = 0, last_day = 0;

    if (cur_month == 12 && cur_days == 31) {
        // 今年
        front_year = cur_year;
        front_month = 1;
        front_day = 1;

        last_year = cur_year;
        last_month = 12;
        last_day = 31;
    }
    else {
        // 去年
        front_year = cur_year - 1;
        front_month = 1;
        front_day = 1;

        last_year = cur_year - 1;
        last_month = 12;
        last_day = 31;
    }

    var begin_tm = onCombineDateTime(front_year, front_month, front_day, '00', '00', '00');
    var end_tm = onCombineDateTime(last_year, last_month, last_day, '23', '59', '59');

    retTime['begin_tm'] = begin_tm;
    retTime['end_tm'] = end_tm;

    return retTime;
}

