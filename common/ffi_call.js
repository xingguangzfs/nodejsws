/**
 * Created by fushou on 2019/4/18.
 */
var ffi = require('ffi');
var ref = require("ref");
var refArray = require("ref-array");

// const path = require("path")
//var libPath = path.join(__dirname,"../../dll/wl");

var root_path = __dirname;

var auth_dll_path = root_path + '\\authclient.dll';

console.log('auth dll path: ' + auth_dll_path);

/*
 var ref = require('ref');
 var intPointer = ref.refType('char');
 var doublePointer = ref.refType('short');
 var charPointer = ref.refType('int');
 var stringPointer = ref.refType('long');
 var boolPointer = ref.refType('bool');

 * */

var intPtr = ref.refType('int');

var auth_lib = ffi.Library(auth_dll_path, {
    'GenClientCode':['int',['pointer', 'int']],
    'GetAuthInfo':['int',['string', intPtr, intPtr, intPtr]]
})

var authclientExport = {
    // 获取客户机代码
    getClientCode: function() {
        var buf_len = 1024;
        var buf = Buffer.alloc(buf_len, " ");

        var result_value = '';
        var result = auth_lib.GenClientCode(buf, buf_len);
        if (result > 0) {
            result_value = buf.toString('ascii');
            result_value = result_value.substr(0, result);
        }
        return result_value;
    },
    // 获取License文件信息
    getAuthInfo: function(file_name) {
        // 预分配INT指针空间
        var intCountHandleRef = ref.alloc('int');
        var intDayHandleRef = ref.alloc('int');
        var intIssueHandleRef = ref.alloc('int');

        var result = auth_lib.GetAuthInfo(file_name, intCountHandleRef, intDayHandleRef, intIssueHandleRef);

        var resultData = {};

        resultData['status'] = result;
        if (result == 0) {
            // 成功
            resultData['count'] = intCountHandleRef.deref();
            resultData['day'] = intDayHandleRef.deref();
            resultData['date'] = intIssueHandleRef.deref();
        }
        return resultData;
    }
};

module.exports = authclientExport;