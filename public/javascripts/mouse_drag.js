/**
 * Created by fushou on 2018/7/4.
 */

var comEvent = {
    addHandle: function(oElement, sEvent, fnHandler) {
        if (oElement.addEventListener) {
            oElement.addEventListener(sEvent, fnHandler, false);
        }
        else {
            oElement.attachEvent('on' + sEvent, fnHandler);
        }
    } ,
    removeHandle: function(oElement, sEvent, fnHandler) {
        if (oElement.removeEventListener) {
            oElement.removeEventListener(sEvent, fnHandler, false);
        }
        else {
            oElement.detachEvent('on' + sEvent, fnHandler);
        }
    }
};

var comDragging = function() {
    // 参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，否则返回null
    var validateHandler = null;
    var draggingObj; // table td

    //validateHandler = document.getElementById('app');

    var mouse_is_down = false;
    var from_td_id = '';
    var to_td_id = '';
    function mouseHandler(e) {
        switch (e.type) {
            case 'mousedown':
                mouse_is_down = true;
                from_td_id = getTdId(e.clientX, e.clientY);
                //validateHandler = null;
                if (from_td_id != undefined && from_td_id.length > 0) {
                    // 查找发生事件的元素
                    validateHandler = document.getElementById(from_td_id);
                }

                if (validateHandler != null) {
                    draggingObj = validateHandler(e); // 这句一定要，起到传递事件消息的作用
                }

                break;

            case 'mousemove':

                break;

            case 'mouseup':
               if (mouse_is_down) {
                    mouse_is_down = false;
                    to_td_id = getTdId(e.clientX, e.clientY);
                    if (from_td_id != to_td_id) {
                        moveDeskAppItem(from_td_id, to_td_id, true);
                    }
                }

                validateHandler = null;
                draggingObj = null;

                break;
        }
    };

    return {
        enable: function() {
            comEvent.addHandle(document, 'mousedown', mouseHandler);
            comEvent.addHandle(document, 'mousemove', mouseHandler);
            comEvent.addHandle(document, 'mouseup', mouseHandler);
        },
        disable: function() {
            comEvent.removeHandle(document, 'mousedown', mouseHandler);
            comEvent.removeHandle(document, 'mousemove', mouseHandler);
            comEvent.removeHandle(document, 'mouseup', mouseHandler);
        }
    }
}

