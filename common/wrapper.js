/**
 * Created by fushou on 2019/7/18.
 */

const async = require('async');

var obj = {
    asyncWrapper: function(fn, interval,...args) {
        var final_callback = args[args.length - 1];

        // 并行执行
        async.parallel([
            // 并行函数一
            function(callback){
                args[args.length - 1] = callback;
                fn.apply(this, args);
            },
            // 并行函数二
            function(callback) {
                timer = setTimeout(function(){
                    callback({
                        code: 408,
                        errno: 408,
                        message: '请求超时'
                    }); // http timeout
                }, interval); // 单位是毫秒
            }
        ],
        // 所有并行函数执行完成后总回调函数
        function(err, results) {
            if (err && err.code == 408 && results[0]) {
                err = null;
            }
            final_callback.apply(this, [err].concat([results[0]]));
        });
    },

    promiseWrapper: function (fn, interval,...args) {
        var final_callback = args[args.length - 1];

        new Promise((resolve, reject)=>{
            args[args.length - 1] = (err,...vals)=>{
                if (err) {
                    reject(err);
                }
                else {
                    resolve(vals);
                };
            };
            fn.apply(this, args);
            setTimeout(_=>{
                reject({
                        code: 408,
                        errno: 408,
                        message: '请求超时'
                    });
            }, interval);
        })
        .then(
            result => {
                final_callback.apply(this, [null].concat(result));
            }
        )
        .catch(err => {
            final_callback(err, null);
        })
    }
}

module.exports = obj;