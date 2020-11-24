/**
 * Created by fushou on 2019/7/27.
 */

// 获取一个websocket连接
function getWebSocketConnect(host, port) {
    var url = "ws://" + host + ":" + port;
    var ws = null;

    // 尝试三次
    for(var idx = 0; idx < 3; idx++) {
        try {
            ws = new WebSocket(url);
        }
        catch(err) {
            ws = null;
        }

        if (ws) {
            break;
        }
    }

    return ws;
}

