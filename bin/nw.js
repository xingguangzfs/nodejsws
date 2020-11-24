/**
 * Created by fushou on 2018/7/6.
 */
// 安装 Windows 服务

let Service = require('node-windows').Service;

let svc = new Service({
    name: 'M.1 WebServer', // 服务名称
    description: '为云应用平台提供Web服务，如果禁用此服务，则云应用平台的功能将无法正常使用。', // 描述
    script: 'C:/Program Files/M.1/WS/bin/www', // nodejs项目启动文件路径
    maxRestarts: 10 // 如果重启失败，则最大尝试次数
});

// 监听安装事件
svc.on('install', () => {
   svc.start();
   console.log('install complete.');
});

svc.on('uninstall', () => {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.on('alreadyinstalled', () => {
   console.log('This service is already installed.');
});

// 如果服务存在则卸载
if (svc.exists) return svc.uninstall();

// 不存在则安装
svc.install();