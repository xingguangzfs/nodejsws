/**
 * Created by fushou on 2019/12/20.
 */

module.exports = {

    // getStatisDbName : 获取统计数据库名称
    getStatisDbName: function(prefix, cycle_id) {
        var db_name = prefix;
        var ext_name = '';

        cycle_id = parseInt(cycle_id);
        switch (cycle_id) {
            case 2: {
                ext_name = 'week';
            }break;

            case 3: {
                ext_name = 'month';
            }break;

            case 4: {
                ext_name = 'quarter';
            }break;

            case 5: {
                ext_name = 'halfyear';
            }break;

            case 6: {
                ext_name = 'year';
            }break;

            default: {
                ext_name = '';
            }break;
        }

        if (ext_name != '') {
            db_name = db_name + '_' + ext_name;
        }
        return db_name;
    }

};