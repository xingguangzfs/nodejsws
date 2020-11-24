/**
 * Created by fushou on 2020/3/5.
 */
var obj = {
    user_data: null,
    completed: null,

    onSetUserData: function(data) {
        this.user_data = data;
    },

    onGetUserData: function() {
        return this.user_data;
    },

    onSetCompleted: function(callback) {
        this.completed = callback;
    },

    onGetCompleted: function() {
        return this.completed;
    },

    onGetModuleId: function () {
        var that = this;
        var owner_data = that.onGetUserData();
        if (owner_data == null || owner_data == undefined) {
            return 0;
        }
        return owner_data[json_key.getIdKey()];
    },

    onGetModuleName: function () {
        var that = this;
        var owner_data = that.onGetUserData();
        if (owner_data == null || owner_data == undefined) {
            return '';
        }
        return owner_data[json_key.getNameKey()];
    }
};

module.exports = obj;