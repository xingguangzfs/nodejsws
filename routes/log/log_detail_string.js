/**
 * Created by fushou on 2019/9/25.
 */

exports.getDetailString = function(tm, position, user_name, event, result, remark) {
    var detail ={
        time: tm,
        position: position,
        target: user_name,
        event: event,
        result: result
    }

    if (remark != undefined) {
        detail['remark'] = remark;
    }

    return JSON.stringify(detail);
}

exports.getDetailString2 = function(tm, position, auth, target, event, remark, result) {
    var detail = {
        time: tm,
        position: position,
        auth: auth,
        target: target,
        event: event,
        result: result,
        remark: remark
    }

    return JSON.stringify(detail);
}
