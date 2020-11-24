/**
 * Created by fushou on 2019/10/28.
 */

function onUpdateTabData(tabElem) {
    if (tabElem == undefined || tabElem == null || tabElem == {}) {
        return;
    }
    var option = tabElem.options;
    var tabId = tabElem.getCurrentTabId();
    var data = option.data;
    if (tabId != undefined && tabId != null && tabId != '' &&
        data && data.length > 0) {
        for(var idx = 0; idx < data.length; idx++) {
            var obj = data[idx];
            if (tabId == obj.id) {
                $("#" + obj.id).load(obj.url, obj.param); // 重新加载当前选中页面数据
                return ;
            }
        }
    }
}

// 获取统计周期
function onGetStatisCycle(callback) {
    var reqUrl = getBaseUrl() + '/statis/cycle';
    var user_name = getAdministratorName();
    var postData = {};
    postData['time'] = new Date().getTime();

    httpPostRequest(reqUrl, user_name, postData, callback);
}

// onGetUserStatisData : 获取用户统计数据
function onGetUserStatisData(postData, callback) {
    var reqUrl = getBaseUrl() + '/statis/user_statis';
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, callback);
}

function onGetHostStatisData(postData, callback) {
    var reqUrl = getBaseUrl() + '/statis/host_statis';
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, callback);
}

function onGetAppStatisData(postData, callback) {
    var reqUrl =getBaseUrl() + '/statis/app_statis';
    var user_name = getAdministratorName();
    httpPostRequest(reqUrl, user_name, postData, callback);
}

function onCheckboxChange(event_src_id, change_dst_id) {
    var src_checkbox_elem = document.getElementById(event_src_id);
    var checked = src_checkbox_elem.checked;

    var dst_elem = document.getElementById(change_dst_id);

    if (checked) {
        dst_elem.style.display = 'block';
    }
    else {
        dst_elem.style.display = 'none';
    }
}

function onParseCycle(prefix, list) {
    var tab_datas = [];

    if (list == undefined || list == null || list.length < 1) {
        return tab_datas;
    }

    for(var idx = 0; idx < list.length; idx++) {
        var itemData = list[idx];

        var item_id = itemData['id'];
        var item_name = itemData['name'];
        var item_title = itemData['title'];
        var item_times = itemData['times'];
        var item_remark = itemData['remark'];

        var days = onGetTimeDays(item_times);

        var tab_item = {};
        tab_item['id'] = item_id;
        tab_item['name'] = item_name;
        tab_item['times'] = item_times;
        tab_item['closeable'] = false;
        tab_item['text'] = onGetTabPageText(days);
        tab_item['url'] = onGetTabPageUrl(prefix, days);

        tab_datas.push(tab_item);
    }

    return tab_datas;
}

function onGetTimeDays(times) {
    var days = 0;
    try {
        days = Math.ceil(parseInt(times) / 24);
    }
    catch(err) {
        days = 0;
    }
    return days;
}

function onGetTabPageText(days) {
    var title = '';

    switch(days){
        case 1:{
            title = '日报';
        }break;

        case 7: {
            title = '周报';
        }break;

        case 30: {
            title = '月报';
        }break;

        case 90: {
            title = '季报';
        }break;

        case 180: {
            title = '半年报';
        }break;

        case 360: {
            title = '年报';
        }break;

        default: {
            title = '其它';
        }break;
    }

    return title;
}

function onGetTabPageUrl(prefix, days) {
    var url = '';

    switch(days) {
        case 1: {
            url = prefix + 'tab_home.html';
        }break;

        case 7: {
            url = prefix + 'tab_week.html';
        }break;

        case 30: {
            url = prefix + 'tab_month.html';
        }break;

        case 90: {
            url = prefix + 'tab_quarter.html';
        }break;

        case 180: {
            url = prefix + 'tab_half_year.html';
        }break;

        case 360: {
            url = prefix + 'tab_year.html';
        }break;

        default: {
            url = prefix + 'tab_other.html';
        }break;
    }

    return url;
}

function onGetQuarterLatelyStartDate() {
    var fmt_year = moment().get('year'); // ct.year()
    var fmt_month = moment().get('month'); // ct.month(); 从0开始
    var fmt_day = moment().get('date'); // ct.date();

    var front_year = 0;
    var front_month = 0;
    var front_day = 0;

    if (fmt_month < 3) {
        // 上一年第四季度
        front_year = fmt_year - 1;
        front_month = 9;
        front_day = 1;
    }
    else if (fmt_month < 6) {
        // 今年第一季度
        front_year = fmt_year;
        front_month = 0;
        front_day = 31;
    }
    else if (fmt_month < 9) {
        // 今年第二季度
        front_year = fmt_year;
        front_month = 3;
        front_day = 30;
    }
    else {
        // 今年第三季度
        front_year = fmt_year;
        front_month = 6;
        front_day = 31;
    }

    var dt = moment().year(front_year).month(front_month).startOf('month').hours(0).minutes(0).seconds(0); // 第一天
    return dt;
}

function onGetQuarterLatelyEndDate() {
    var fmt_year = moment().get('year'); // ct.year()
    var fmt_month = moment().get('month'); // ct.month(); 从0开始
    var fmt_day = moment().get('date'); // ct.date();

    var back_year = 0;
    var back_month = 0;
    var back_day = 0;

    if (fmt_month < 3) {
        // 上一年第四季度
        back_year = fmt_year - 1;
        back_month = 11;
        back_day = 31;
    }
    else if (fmt_month < 6) {
        // 今年第一季度
        back_year = fmt_year;
        back_month = 2;
        back_day = 31;
    }
    else if (fmt_month < 9) {
        // 今年第二季度
        back_year = fmt_year;
        back_month = 5;
        back_day = 30;
    }
    else {
        // 今年第三季度
        back_year = fmt_year;
        back_month = 8;
        back_day = 30;
    }

    var dt = moment().year(back_year).month(back_month).endOf('month').hours(23).minutes(59).seconds(59); // 最后一天
    return dt;
}

function onGetHalfYearStartDate() {
    var fmt_year = moment().get('year'); // ct.year()
    var fmt_month = moment().get('month'); // ct.month(); 从0开始

    var front_year = 0;
    var front_month = 0;

    if (fmt_month < 6) {
        // 上一年下半年
        front_year = fmt_year - 1;
        front_month = 6;
    }
    else {
        // 今年上半年
        front_year = fmt_year;
        front_month = 0;
    }

    var dt = moment().year(front_year).month(front_month).startOf('month').hours(0).minutes(0).seconds(0); // 第一天
    return dt;
}

function onGetHalfYearEndDte() {
    var fmt_year = moment().get('year'); // ct.year()
    var fmt_month = moment().get('month'); // ct.month(); 从0开始

    var front_year = 0;
    var front_month = 0;

    if (fmt_month < 6) {
        // 上一年下半年
        front_year = fmt_year - 1;
        front_month = 11;
    }
    else {
        // 今年上半年
        front_year = fmt_year;
        front_month = 5;
    }

    var dt = moment().year(front_year).month(front_month).endOf('month').hours(23).minutes(59).seconds(59); // 最后一天
    return dt;
}

// onGetDateRangeOptions : 返回日期控件的选项参数
function onGetDateRangeOptions(type) {
    var start_dt = null;
    var end_dt = null;
    var max_dt = null;
    var linked_calendars = true;
    var ranges = null;

    var locale = {
        format: "YYYY-MM-DD", //设置显示格式 YYYY-MM-DD HH:mm:ss
        applyLabel: '确 定', //确定按钮文本
        cancelLabel: '取 消', //取消按钮文本
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        firstDay: 1
    };

    switch(type) {
        case 'month':
        { // 月
            start_dt =  moment().month(moment().month() - 1).startOf('month').hours(0).minutes(0).seconds(0); // 上个月第一天
            end_dt = moment().month(moment().month() - 1).endOf('month').hours(23).minutes(59).seconds(59); // 上个月最后一天
            max_dt = end_dt;

            ranges = {
                '最近1个月': [start_dt, end_dt], // 上个月第一天
                '最近2个月': [moment().month(moment().month() - 2).startOf('month').hours(0).minutes(0).seconds(0), end_dt] // 上上个月第一天
            };
        }break;

        case 'quarter':
        { // 季度
            start_dt = onGetQuarterLatelyStartDate(); // 第一天
            end_dt = onGetQuarterLatelyEndDate(); // 最后一天
            max_dt = moment().subtract(1, 'days'); // 昨天

            ranges = {
                '最近一个季度': [start_dt, end_dt]
            };

            linked_calendars = false;
        }break;

        case 'halfyear':
        {
            start_dt = onGetHalfYearStartDate();
            end_dt = onGetHalfYearEndDte();
            max_dt = moment().subtract(1, 'days'); // 昨天

            ranges = {
                '最近半年': [start_dt, end_dt]
            }

            linked_calendars = false;
        }break;

        case 'year':
        {
            start_dt = moment().year(moment().year() - 1).month(0).startOf('month').hours(0).minutes(0).seconds(0);
            end_dt = moment().year(moment().year() - 1).month(11).endOf('month').hours(23).minutes(59).seconds(59);

            max_dt = moment().subtract(1, 'days'); // 昨天

            ranges = {
                '最近一年': [start_dt, end_dt]
            }

            linked_calendars = false;
        }break;

        default:
        {
            start_dt =  moment().subtract(7, 'days').hours(0).minutes(0).seconds(0);
            end_dt = moment().subtract(1, 'days');
            max_dt = end_dt;

            ranges = {
                '最近7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
                '最近15天': [moment().subtract(15, 'days'), moment().subtract(1, 'days')],
                '最近30天': [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
            };

        }break;
    }

    var options = {};

    options['timePicker'] = false; // 是否允许选择时间
    options['timePicker24Hour'] = true; // 时间制
    options['timePickerSeconds'] = true; // 时间显示到秒
    options['showDropdowns'] = false; // 在月和年的下面显示下拉选择框
    options['linkedCalendars'] = linked_calendars; // 是否启用时显示的为连接的月份
    options['startDate'] = start_dt;
    options['endDate'] = end_dt;
    options['maxDate'] = max_dt;
    options['opens'] = 'right';
    options['ranges'] = ranges; // 显示的最近日期列表
    options['showWeekNumbers'] = true;
    options['locale'] = locale;

    return options;
}

function onInitDateRange(id, type, change_callback) {

    /*var options = {
        timePicker: false, // 是否允许选择时间
        timePicker24Hour: true, // 时间制
        timePickerSeconds: true, // 时间显示到秒
        showDropdowns: false, // 在月和年的下面显示下拉选择框
        linkedCalendars: true, // 启用时显示的为连接的月份
        startDate: moment().subtract(7, 'days').hours(0).minutes(0).seconds(0), //设置开始日期
        endDate: moment().subtract(1, 'days'), //设置结束器日期
        maxDate: moment().subtract(1, 'days'), // 最大时间为前一天
        "opens": "right",
        ranges: {
            '最近7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
            '最近15天': [moment().subtract(15, 'days'), moment().subtract(1, 'days')],
            '最近30天': [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
        },
        showWeekNumbers: true,
        locale: {
            format: "YYYY-MM-DD", //设置显示格式 YYYY-MM-DD HH:mm:ss
            applyLabel: '确 定', //确定按钮文本
            cancelLabel: '取 消', //取消按钮文本
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'
            ],
            firstDay: 1
        }
    }*/

    var options = onGetDateRangeOptions(type);

    var component = $("#" + id).daterangepicker(options, function(start, end, label){
        if (change_callback) {
            change_callback(start, end);
        }
        // console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    return component;
}

// onChartTrendLineDisplay : 趋势线显示
function onChartTrendLineDisplay(id, title, x_axis_data, series_name, series_data) {
    var trend_option = {
        title: {
            left: 'center',
            text: title,
            textStyle: {
                fontSize: '15'
            }
        },
        tooltip: {},
        legend: {
            data: []
        },
        xAxis: {
            data: x_axis_data
        },
        yAxis: {

        },
        series: [
            {
                name: series_name,
                type: 'line',
                data: series_data
            }
        ]
    }

    var trend_chart = echarts.init(document.getElementById(id));
    trend_chart.setOption(trend_option);

    return trend_chart;
}