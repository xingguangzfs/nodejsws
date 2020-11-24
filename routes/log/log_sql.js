/**
 * Created by fushou on 2019/9/21.
 */

var util = require('../../common/util');
var json_key = require('../../common/json_key');

function onIsStringFieldType(field_name) {
    var is_string = false;
    switch(field_name) {
        case 'source':
        case 'event_tm':
        case 'record_tm':
        case 'user_name':
        case 'info':
        case 'detail':
        case 'remark':
        {
            is_string = true;
        }break;
    }
    return is_string;
}

function onGetWhereAndSql(param, where_op) {
    // 条件语句
    var item_count = 0;
    var strSql = "";

    for(var key in param) {
        var item_name = key;
        var item_value = param[key];

        if (util.IsEmpty(item_name) || util.IsEmpty(item_value)) {
            continue;
        }

        if (item_count > 0) {
            strSql += " " + where_op + " ";
        }

        strSql += item_name + "=";

        if (onIsStringFieldType(item_name)) {
            strSql += "'" + item_value + "'";
        }
        else {
            strSql += item_value;
        }

        item_count++;
    }

    if (item_count > 0) {

    }
    else {
        strSql = "";
    }

    return strSql;
}

function onGetInsertSql(param, db_name) {
    // INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)

    var strSql = "";
    var strFieldsSql = "";
    var strValueSql = "";
    var item_count = 0;

    for(var key in param) {
        var item_name = key;
        var item_value = param[key];

        if (util.IsEmpty(item_name) || util.IsEmpty(item_value)) {
            continue;
        }

        if (item_count > 0) {
            strFieldsSql += ",";
            strValueSql += ",";
        }

        strFieldsSql += item_name;

        if (onIsStringFieldType(item_name)) {
            strValueSql += "'" + item_value + "'";
        }
        else {
            strValueSql += item_value;
        }

        item_count++;
    }

    if (item_count > 0) {
        strSql = "INSERT INTO " + db_name;
        strSql += "(" + strFieldsSql + ") ";
        strSql += " VALUES (" + strValueSql + ") ";
    }
    else {
        strSql = "";
    }

    return strSql;
}

function onGetModifySql(param, where_param, db_name) {
    // UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值

    var strSql = "";
    var strSetSql = "";
    var item_count = 0;

    for(var key in param) {
        var item_name = key;
        var item_value = param[key];

        if (util.IsEmpty(item_name)) {
            continue;
        }

        if (util.IsEmpty(item_value)) {
            item_value = null;
        }

        // 条件字段判断值是否需要更新
        var item_where_value = where_param[key];
        if (!util.IsEmpty(item_where_value) && item_value == item_where_value) {
            continue;
        }

        if (item_count > 0) {
            strSetSql += ",";
        }

        strSetSql += item_name + "=";
        if (onIsStringFieldType(item_name)) {
            if (item_value == null) {
                item_value = '';
            }
            strSetSql += "'" + item_value + "'";
        }
        else {
            if (item_value == null) {
                item_value = 0;
            }
            strSetSql += item_value;
        }

        item_count++;
    }

    if (item_count > 0) {
        var strWhereSql = onGetWhereAndSql(where_param, 'AND');

        strSql = "UPDATE " + db_name + " SET ";
        strSql += strSetSql;

        if (!util.IsEmpty(strWhereSql)) {
            strSql += " WHERE " + strWhereSql;
        }
    }
    else {
        strSql = "";
    }

    return strSql;
}

function onGetDeleteSql(where_param, db_name) {
    // DELETE FROM 表名称 WHERE 列名称 = 值

    var strSql = "";
    var strWhereSql = "";

    strWhereSql = onGetWhereAndSql(where_param, 'AND');

    strSql = "DELETE FROM " + db_name;

    if (!util.IsEmpty(strWhereSql)) {
        strSql += " WHERE " + strWhereSql;
    }

    return strSql;
}

function onGetQuerySql(fields, where_param, where_op, db_name) {
    var strSql = "";
    var strFieldsSql = "";
    var strWhereSql = "";
    var item_count = 0;

    if (fields != undefined && fields != null) {
        for (var idx = 0; idx < fields.length; idx++) {
            var item_name = fields[idx];

            if (util.IsEmpty(item_name)) {
                continue;
            }

            if (item_count > 0) {
                strFieldsSql += ",";
            }

            strFieldsSql += item_name;

            item_count++;
        }
    }

    strWhereSql = onGetWhereAndSql(where_param, where_op);

    if (item_count > 0) {
        strSql = "SELECT " + strFieldsSql;
        strSql += " FROM " + db_name;
    }
    else {
        strSql = "SELECT * FROM " + db_name;
    }

    if (!util.IsEmpty(strWhereSql)) {
        strSql += " WHERE " + strWhereSql;
    }

    return strSql;
}

function onGetQuerySql2(fields, where_sql, db_name) {
    var strSql = "";
    var strFieldsSql = "";
    var strWhereSql = "";
    var item_count = 0;

    if (fields != undefined && fields != null) {
        for (var idx = 0; idx < fields.length; idx++) {
            var item_name = fields[idx];

            if (util.IsEmpty(item_name)) {
                continue;
            }

            if (item_count > 0) {
                strFieldsSql += ",";
            }

            strFieldsSql += item_name;

            item_count++;
        }
    }

    if (item_count > 0) {
        strSql = "SELECT " + strFieldsSql;
        strSql += " FROM " + db_name;
    }
    else {
        strSql = "SELECT * FROM " + db_name;
    }

    if (!util.IsEmpty(where_sql)) {
        strSql += " WHERE " + where_sql;
    }

    return strSql;
}

exports.getLogAdminDbName = function() {
    return 'log_admin';
}

exports.getLogUserDbName = function() {
    return 'log_user';
}

/******************************************************************************/
/* 管理员用户日志 */
/******************************************************************************/
exports.getLogAdminInsertSql = function(param) {
    var db_name = this.getLogAdminDbName();
    var strSql = onGetInsertSql(param, db_name);
    return strSql;
}

exports.getLogAdminModifySql = function(param, where_param) {
    var db_name = this.getLogAdminDbName();
    var strSql = onGetModifySql(param, where_param, db_name);
    return strSql;
}

exports.getLogAdminDeleteSql = function(where_param) {
    var db_name = this.getLogAdminDbName();
    var strSql = onGetDeleteSql(where_param, db_name);
    return strSql;
}

exports.getLogAdminQuerySql = function(fields, where_param, where_op) {
    var db_name = this.getLogAdminDbName();
    var strSql = onGetQuerySql(fields, where_param, where_op, db_name);
    return strSql;
}

exports.getLogAdminQuerySql2 = function(fields, where_sql) {
    var db_name = this.getLogAdminDbName();
    var strSql = onGetQuerySql2(fields, where_sql, db_name);
    return strSql;
}

/******************************************************************************/
/* 普通用户日志 */
/******************************************************************************/
exports.getLogUserInsertSql = function(param) {
    var db_name = this.getLogUserDbName();
    var strSql = onGetInsertSql(param, db_name);
    return strSql;
}

exports.getLogUserModifySql = function(param, where_param) {
    var db_name = this.getLogUserDbName();
    var strSql = onGetModifySql(param, where_param, db_name);
    return strSql;
}

exports.getLogUserDeleteSql = function(where_param) {
    var db_name = this.getLogUserDbName();
    var strSql = onGetDeleteSql(where_param, db_name);
    return strSql;
}

exports.getLogUserQuerySql = function(fields, where_param, where_op) {
    var db_name = this.getLogUserDbName();
    var strSql = onGetQuerySql(fields, where_param, where_op, db_name);
    return strSql;
}

exports.getLogUserQuerySql2 = function(fields, where_sql) {
    var db_name = this.getLogUserDbName();
    var strSql = onGetQuerySql2(fields, where_sql, db_name);
    return strSql;
}



