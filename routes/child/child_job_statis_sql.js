/**
 * Created by fushou on 2019/12/19.
 */
var util = require('../../common/util');

module.exports = {

    onCorrectNumberValue: function(val) {
        if (val == undefined || val == null || val == '') {
            return 0;
        }
        return val;
    },

    // getQueryUserStatisSql : 获取查询用户统计数据SQL语句
    getQueryUserStatisSql : function(db_name, cycle_id, begin_tm, end_tm) {
        var strSql = "SELECT DATE_FORMAT(begin_tm, '%Y-%m-%d %H:%i:%s') AS begin_tm,";
        strSql += "DATE_FORMAT(end_tm, '%Y-%m-%d %H:%i:%s') AS end_tm FROM ";
        strSql += db_name;
        strSql += " WHERE cycle_id=" + cycle_id;
        strSql += " AND begin_tm >= '" + begin_tm + "' ";
        strSql += " AND end_tm <= '" + end_tm + "' ";

        return strSql;
    },

    // getQueryAsStatisSql : 获取查询主机统计数据SQL语句
    getQueryAsStatisSql: function(db_name, cycle_id, begin_tm, end_tm) {
        var strSql = "SELECT DATE_FORMAT(begin_tm, '%Y-%m-%d %H:%i:%s') AS begin_tm,";
        strSql += "DATE_FORMAT(end_tm,'%Y-%m-%d %H:%i:%s') AS end_tm FROM ";
        strSql += db_name;
        strSql += " WHERE cycle_id=" + cycle_id;
        strSql += " AND begin_tm >= '" + begin_tm + "' ";
        strSql += " AND end_tm <= '" + end_tm + "' ";

        return strSql;
    },

    // getQueryAppStatisSql : 获取查询应用统计数据SQL语句
    getQueryAppStatisSql: function(db_name, cycle_id, begin_tm, end_tm) {
        var strSql = "SELECT DATE_FORMAT(begin_tm, '%Y-%m-%d %H:%i:%s') AS begin_tm,";
        strSql += "DATE_FORMAT(end_tm, '%Y-%m-%d %H:%i:%s') AS end_tm FROM ";
        strSql += db_name;
        strSql += " WHERE cycle_id=" + cycle_id;
        strSql += " AND begin_tm >= '" + begin_tm + "' ";
        strSql += " AND end_tm <= '" + end_tm + "' ";

        return strSql;
    },

    // getUpdateUserStatisSql : 获取更新用户统计数据SQL语句
    getUpdateUserStatisSql: function(db_name, cycle_id, begin_tm, end_tm, begin_index, end_index, data_list) {
        if (data_list == undefined || data_list == null || data_list.length < 1) {
            return null;
        }
        if (begin_index < 0 || begin_index >= data_list.length) {
            return null;
        }

        if (begin_index >= end_index || end_index > data_list.length) {
            return null;
        }

        // 一次更新多行
        var cur_tm = util.getFormatCurTime();
        var remark = '';

        var strSql = "INSERT INTO ";
        strSql += db_name;
        strSql += " (user_name,cycle_id,cycle_tm,begin_tm,";
        strSql += "end_tm,login_count,app_count,app_inst_count,";
        strSql += "remark) VALUES ";

        for(var idx = begin_index; idx < end_index; idx++) {
            var itemData = data_list[idx];

            var item_user_name = itemData['user_name'];
            var item_login_count = itemData['login_count'];
            var item_app_count = itemData['app_count'];
            var item_app_inst_count = itemData['app_inst_count'];

            item_login_count = this.onCorrectNumberValue(item_login_count);
            item_app_count = this.onCorrectNumberValue(item_app_count);
            item_app_inst_count = this.onCorrectNumberValue(item_app_inst_count);

            if (idx > begin_index) {
                strSql += ",";
            }
            strSql += "(";
            strSql += "'" + item_user_name + "',";
            strSql += cycle_id + ",";
            strSql += "'" + cur_tm + "',";
            strSql += "'" + begin_tm + "',";
            strSql += "'" + end_tm + "',";
            strSql += item_login_count + ",";
            strSql += item_app_count + ",";
            strSql += item_app_inst_count + ",";
            strSql += "'" + remark + "'";
            strSql += ")";
        }

        return strSql;
    },

    // getUpdateAsStatisSql : 获取更新主机统计数据SQL语句
    getUpdateAsStatisSql: function(db_name, cycle_id, begin_tm, end_tm, begin_index, end_index, data_list) {
        if (data_list == undefined || data_list == null || data_list.length < 1) {
            return null;
        }
        if (begin_index < 0 || begin_index >= data_list.length) {
            return null;
        }

        if (begin_index >= end_index || end_index > data_list.length) {
            return null;
        }

        // 一次更新多行
        var cur_tm = util.getFormatCurTime();
        var remark = '';

        var strSql = "INSERT INTO ";
        strSql += db_name;
        strSql += " (ip_addr,cycle_id,cycle_tm,begin_tm,";
        strSql += "end_tm,online_count,offline_count,user_count,";
        strSql += "app_count,app_inst_count,remark) VALUES ";

        for(var idx = begin_index; idx < end_index; idx++) {
            var itemData = data_list[idx];

            var item_ip_addr = itemData['ip_addr'];
            var item_online_count = itemData['online_count'];
            var item_offline_count = itemData['offline_count'];
            var item_user_count = itemData['user_count'];
            var item_app_count = itemData['app_count'];
            var item_app_inst_count = itemData['app_inst_count'];

            item_online_count = this.onCorrectNumberValue(item_online_count);
            item_offline_count = this.onCorrectNumberValue(item_offline_count);
            item_user_count = this.onCorrectNumberValue(item_user_count);
            item_app_count = this.onCorrectNumberValue(item_app_count);
            item_app_inst_count = this.onCorrectNumberValue(item_app_inst_count);

            if (idx > begin_index) {
                strSql += ",";
            }
            strSql += "(";
            strSql += "'" + item_ip_addr + "',";
            strSql += cycle_id + ",";
            strSql += "'" + cur_tm + "',";
            strSql += "'" + begin_tm + "',";
            strSql += "'" + end_tm + "',";
            strSql += item_online_count + ",";
            strSql += item_offline_count + ",";
            strSql += item_user_count + ",";
            strSql += item_app_count + ",";
            strSql += item_app_inst_count + ",";
            strSql += "'" + remark + "'";
            strSql += ")";
        }

        return strSql;
    },

    // getUpdateAppStatis : 获取更新应用统计数据SQL语句
    getUpdateAppStatisSql: function(db_name, cycle_id, begin_tm, end_tm, begin_index, end_index, data_list) {
        if (data_list == undefined || data_list == null || data_list.length < 1) {
            return null;
        }
        if (begin_index < 0 || begin_index >= data_list.length) {
            return null;
        }
        if (begin_index >= end_index || end_index > data_list.length) {
            return null;
        }

        // 一次更新多行
        var cur_tm = util.getFormatCurTime();
        var remark = '';

        var strSql = "INSERT INTO ";
        strSql += db_name;
        strSql += " (file_name,app_full_name,app_desc,app_size,cycle_id,";
        strSql += "cycle_tm,begin_tm,end_tm,host_count,user_count,";
        strSql += "app_inst_count,remark) VALUES ";

        for(var idx = begin_index; idx < end_index; idx++) {
            var itemData = data_list[idx];

            var item_app_full_name = itemData['app_full_name'];
            var item_file_name = itemData['file_name'];
            var item_app_desc = itemData['file_desc'] || itemData['app_desc'];
            var item_app_size = itemData['file_size'] || itemData['app_size'];
            var item_host_count = itemData['host_count'];
            var item_user_count = itemData['user_count'];
            var item_app_inst_count = itemData['app_inst_count'];

            item_app_full_name = JSON.stringify(item_app_full_name);

            item_app_size = this.onCorrectNumberValue(item_app_size);
            item_host_count = this.onCorrectNumberValue(item_host_count);
            item_user_count = this.onCorrectNumberValue(item_user_count);
            item_app_inst_count = this.onCorrectNumberValue(item_app_inst_count);

            if (idx > begin_index) {
                strSql += ",";
            }
            strSql += "(";
            strSql += "'" + item_file_name + "',";
            strSql += "'" + item_app_full_name + "',";
            strSql += "'" + item_app_desc + "',";
            strSql += item_app_size + ",";
            strSql += cycle_id + ",";
            strSql += "'" + cur_tm + "',";
            strSql += "'" + begin_tm + "',";
            strSql += "'" + end_tm + "',";
            strSql += item_host_count + ",";
            strSql += item_user_count + ",";
            strSql += item_app_inst_count + ",";
            strSql += "'" + remark + "'";
            strSql += ")";
        }

        return strSql;
    }

}
