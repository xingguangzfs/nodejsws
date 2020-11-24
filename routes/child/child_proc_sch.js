/**
 * Created by fushou on 2019/6/19.
 */
var child_filter_sch = require('./child_filter_sch');
var util = require('../../common/util');



console.log('child execArgv: ' + JSON.stringify(process.execArgv));

util.SetPrintLog(true);

// 子进程监听消息
process.on('message', function(m) {
    child_filter_sch.onFilter(m);
});
