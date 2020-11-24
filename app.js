var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressJWT = require('express-jwt');

var util = require('./common/util');

var cache = require('./common/Node-Simple-Cache-master/Manage');

// 子服务，每个了服务创建一个服务进程
var child_service = require('./routes/child/child_service');

var child_ws_client = require('./routes/child/child_ws_client');

// 路由表
var router = require('./routes/router');
var router_list = router.getRouters();

// token验证例外列表
//var unless_list = router.getUnless();

// filter
var filter = require('./routes/filter');

var app = express();

// 初始化自定义全局变量
util.SetRootPath(__dirname);
util.SetPrintLog(true);
util.SetCache(cache);

//var secretPrivateKey = util.getSecret();
//console.log(secretPrivateKey);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//desk.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// token认证
/*app.use(expressJWT({
  secret: secretPrivateKey
}).unless({
  path: unless_list
}))*/

// token验证通过后进行全局拦截处理
app.use(function(req, res, next){
  filter.filter(req, res, next);
})

// 路由映射
for(var i = 0; i < router_list.length; i++) {
  var route_item = router_list[i];
  if (route_item.length < 2) {
    continue;
  }
  app.use(route_item[0], route_item[1]);
}

// 启动子服务模块
util.getMonPort(function(mon_port){

  util.SetMonPort(mon_port);
  child_service.start();
  util.SetChildService(child_service);

  // 延迟启动websocket客户端
  var wsc_timer = setTimeout(function(){
    var host = '127.0.0.1';
    child_ws_client.connect(host, mon_port);
    clearTimeout(wsc_timer);
    wsc_timer = null;

    util.SetWebClient(child_ws_client);

  }, 1000);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*process.on('exit', function(code){
  console.log('node master process exit ' + JSON.stringify(code));
});*/

// 捕获ctrl+c事件
process.on('SIGINT', function(){
  console.log('node master process ctrl+c exit.');
  var child_service = util.GetChildService();
  if (child_service) {
    child_service.stop();
  }

  // 延迟关闭进程
  var timer = setTimeout(function(){
    process.exit();

    clearTimeout(timer);
    timer = null;
  }, 1000);
})

module.exports = app;
