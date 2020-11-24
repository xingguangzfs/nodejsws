/**
 * Created by fushou on 2019/8/7.
 */
var array = require('./array');

function map_array() {
    // item : { key: key, value: value}
    //var item_key_name = 'key';
    //var item_value_name = 'value';

    this.map_list = [];

    function getItemKeyName() {
        return 'key';
    }

    function getItemValueName() {
        return 'value';
    }

    this.createNewItem = function(key, val) {
        var that = this;

        if (that.isEmpty(key) || that.isEmpty(val)) {
            return null;
        }

        var value = array.createArray();
        if (!that.isEmpty(val)) {
            value.append(val);
        }

        var itemData = {}

        itemData[getItemKeyName()] = key;
        itemData[getItemValueName()] = value;

        return itemData;
    }

    this.isEmpty = function(val) {
        if (val == null || val == undefined || val == '' || val.length == 0 || val == {}) {
            return true;
        }
        return false;
    }

    this.itemCount = function() {
        var that = this;
        return that.map_list.length;
    }

    this.dataCount = function() {
        var that = this;

        var count = 0;

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];

            var item_value = itemData[getItemValueName()];

            count += item_value.count();
        }

        return count;
    }

    this.itemDataCount = function(key) {
        var that = this;

        if (that.isEmpty(key)) {
            return 0;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];
            if (key == itemData[getItemKeyName()]) {
                return itemData[getItemValueName()].count();
            }
        }

        return 0;
    }

    this.getItem = function(key) {
        var that = this;

        if (that.isEmpty(key)) {
            return null;
        }

        for (var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];
            if (key == itemData[getItemKeyName()]) {
                return itemData[getItemValueName()];
            }
        }

        return null;
    }

    this.getValue = function(key, index) {
        var that = this;

        if (that.isEmpty(key)) {
            return null;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];
            if (key == itemData[getItemKeyName()]) {
                return itemData[getItemValueName()].getValue(index);
            }
        }

        return null;
    }

    this.setValue = function(key, val) {
        var that = this;

        if (that.isEmpty(key) || that.isEmpty(val)) {
            return;
        }

        // 追加项值
        if (!that.appendItemValue(key, val)) {
            // 新建项
            var itemData = that.createNewItem(key, val);
            if (itemData != null) {
                that.map_list.push(itemData);
            }
        }
    }

    this.itemIndexOf = function(key) {
        var that = this;

        if (that.isEmpty(key)) {
            return -1;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];

            var item_key = itemData[getItemKeyName()];

            if (key == item_key) {
                return idx;
            }
        }

        return -1;
    }

    this.itemDataIndexOf = function(key, val) {
        var that = this;

        if (that.isEmpty(key) || that.isEmpty(val)) {
            return -1;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];

            var item_key = itemData[getItemKeyName()];
            var item_value = itemData[getItemValueName()];

            if (key == item_key) {
                return item_value.indexOf(val);
            }
        }

        return -1;
    }

    this.appendItemValue = function(key, val) {
        var that = this;

        if (that.isEmpty(key) || that.isEmpty(val)) {
            return false;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];
            if (key == itemData[getItemKeyName()]) {
                itemData[getItemValueName()].append(val);
                return true;
            }
        }
        return false;
    }

    this.removeItem = function(key) {
        var that = this;

        if (that.isEmpty(key)) {
            return;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];
            if (key == itemData[getItemKeyName()]) {
                itemData[getItemValueName()].clear();

                that.map_list.splice(idx, 1); // 删除
                return;
            }
        }
    }

    this.removeItemData = function(key, val) {
        var that = this;

        if (that.isEmpty(key) || that.isEmpty(val)) {
            return ;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];

            var item_key = itemData[getItemKeyName()];
            var item_value = itemData[getItemValueName()];

            if (key == item_key) {
                item_value.remove2(val);
                return;
            }
        }
    }

    this.removeData = function(val) {
        var that = this;

        if (this.isEmpty(val)) {
            return;
        }

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];

            var item_key = itemData[getItemKeyName()];
            var item_value = itemData[getItemValueName()];

            item_value.remove2(val);
        }
    }

    this.clear = function() {
        var that = this;

        for(var idx = 0; idx < that.map_list.length; idx++) {
            that.map_list[idx][getItemValueName()].clear();
        }

        that.map_list = [];
    }

    this.print = function(stuff) {
        var that = this;

        console.log('list data...');

        for(var idx = 0; idx < that.map_list.length; idx++) {
            var itemData = that.map_list[idx];

            var item_key = itemData[getItemKeyName()];
            var item_value = itemData[getItemValueName()];

            var msg = '';
            if (stuff != undefined) {
                msg += stuff;
            }
            msg += ' item --- ';
            msg += ' [key]: ' + item_key;

            msg += ' [value]: ' + item_value.toString();

            console.log(msg);
        }

        console.log('list data end.');
    }
}

exports.createMapArray = function() {
    return new map_array();
}