/**
 * Created by fushou on 2019/8/7.
 */

function array() {
    this.list = [];

    this.isEmpty = function() {
        var that = this;
        return (that.list.length == 0);
    }

    this.count = function() {
        var that = this;
        return that.list.length;
    }

    this.get = function() {
        var that = this;

        return that.list;
    }

    this.isExist = function(val) {
        var that = this;
        for(var idx = 0; idx < that.list.length; idx++) {
            if (val == that.list[idx]) {
                return true;
            }
        }
        return false;
    }

    this.append = function(val) {
        var that = this;
        if (!that.isExist(val)) {
            that.list.push(val);
        }
    }

    this.insert = function(index, val) {
        var that = this;

        if (that.isExist(val)) {
            return;
        }

        if (index < 0 || index >= that.list.length) {
            that.list.push(val);
        }
        else {
            that.list.splice(index, 0, val); // 追加
        }
    }

    this.remove = function(index) {
        var that = this;

        if (index >= 0 && index < that.list.length) {
            var num = that.list.splice(index, 1); // 删除
        }
    }

    this.remove2 = function(val) {
        var that = this;

        var index = that.indexOf(val);
        if (index >= 0) {
            that.remove(index);
        }
    }

    this.removeFirst = function() {
        var that = this;

        if (that.list.length > 0) {
            that.list.shift();
        }
    }

    this.removeLast = function() {
        var that = this;

        if (that.list.length > 0) {
            that.list.pop();
        }
    }

    this.indexOf = function(val) {
        var that = this;

        for(var idx = 0; idx < that.list.length; idx++) {
            if (val == that.list[idx]) {
                return idx;
            }
        }
        return -1;
    }

    this.indexOfLast = function(val) {
        var that = this;

        for(var idx = that.list.length - 1; idx >= 0; idx--) {
            if (val == that.list[idx]) {
                return idx;
            }
        }
        return -1;
    }

    this.getValue = function(index) {
        var that = this;

        if (index >= 0 && index < that.list.length) {
            return that.list[index];
        }

        return null;
    }

    this.clear = function() {
        var that = this;

        that.list = [];
    }

    this.toString = function() {
        var that = this;

        var resData = '';

        if (that.list.length > 0) {
            resData = that.list.toString();
        }

        return resData;
    }

    this.print = function(stuff) {
        var that = this;

        if (stuff != undefined && stuff != null && stuff != '' && stuff.length > 0) {
            console.log(stuff + ': ' + that.list.toString());
        }
        else {
            console.log(that.list.toString());
        }
    }
}

exports.createArray = function() {
    return new array();
}