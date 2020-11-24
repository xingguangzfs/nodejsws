/**
 * Created by fushou on 2019/6/11.
 */

exports.getRouters = function() {
    var router_list = [
        ['/',require('./index')],
        ['/login',  require('./login')],
        ['/logout', require('./logout')],

        ['/heart', require('./heart')], // 心跳包

        ['/manage/file_upload', require('./manage/file_upload')],
        ['/manage/license_gen', require('./manage/license_gen')],
        ['/manage/license_query', require('./manage/license_query')],
        ['/manage/allow_add_user', require('./manage/allow_add_user')],

        ['/manage/app_image_get', require('./manage/app_image_get')],
        ['/manage/app_image_confirm', require('./manage/app_image_confirm')],
        ['/manage/app_query', require('./manage/app_query')],
        ['/manage/app_map_query', require('./manage/app_map_query')],
        ['/manage/app_verify', require('./manage/app_verify')],
        ['/manage/app_modify_group', require('./manage/app_modify_group')],
        ['/manage/app_modify', require('./manage/app_modify')],
        ['/manage/app_delete', require('./manage/app_delete')],
        ['/manage/def_app_list', require('./manage/def_app_list')],

        ['/manage/image_list', require('./manage/image_list')],
        ['/manage/image_add', require('./manage/image_add')],
        ['/manage/image_del', require('./manage/image_del')],
        ['/manage/image_query', require('./manage/image_query')],
        ['/manage/image_modify', require('./manage/image_modify')],
        ['/manage/image_security_del', require('./manage/image_security_del')],

        ['/manage/user_group_query', require('./manage/user_group_query')],
        ['/manage/user_modify', require('./manage/user_modify')],
        ['/manage/user_query', require('./manage/user_query')],
        ['/manage/user_name_verify', require('./manage/user_name_verify')],
        ['/manage/user_delete', require('./manage/user_delete')],
        ['/manage/user_pswd_modify', require('./manage/user_pswd_modify')],
        ['/manage/user_simple_query', require('./manage/user_simple_query')],
        ['/manage/user_app_query', require('./manage/user_app_query')],
        ['/manage/user_modify_group', require('./manage/user_modify_group')],
        ['/manage/user_ext_modify', require('./manage/user_ext_modify')],
        ['/manage/user_ext_query', require('./manage/user_ext_query')],
        ['/manage/user_batch_modify', require('./manage/user_batch_modify')],

        ['/manage/host_ip_addr_verify', require('./manage/host_ip_addr_verify')],
        ['/manage/host_modify', require('./manage/host_modify')],
        ['/manage/host_query', require('./manage/host_query')],
        ['/manage/host_delete', require('./manage/host_delete')],
        ['/manage/host_modify_group', require('./manage/host_modify_group')],
        ['/manage/host_discover', require('./manage/host_discover')],
        ['/manage/host_batch_modify', require('./manage/host_batch_modify')],

        ['/manage/user_group_name_verify', require('./manage/user_group_name_verify')],
        ['/manage/user_group_modify', require('./manage/user_group_modify')],
        ['/manage/user_group_delete', require('./manage/user_group_delete')],

        ['/manage/app_auth_query', require('./manage/app_auth_query')],
        ['/manage/app_auth_modify', require('./manage/app_auth_modify')],
        ['/manage/app_auth_detail', require('./manage/app_auth_detail')],
        ['/manage/app_auth_delete', require('./manage/app_auth_delete')],

        ['/manage/host_group_query', require('./manage/host_group_query')],
        ['/manage/host_group_delete', require('./manage/host_group_delete')],
        ['/manage/host_group_modify', require('./manage/host_group_modify')],
        ['/manage/host_group_name_verify', require('./manage/host_group_name_verify')],

        ['/manage/host_auth_query', require('./manage/host_auth_query')],
        ['/manage/host_auth_detail', require('./manage/host_auth_detail')],
        ['/manage/host_auth_modify', require('./manage/host_auth_modify')],
        ['/manage/host_auth_delete', require('./manage/host_auth_delete')],

        ['/manage/app_group_query', require('./manage/app_group_query')],
        ['/manage/app_group_modify', require('./manage/app_group_modify')],
        ['/manage/app_group_delete', require('./manage/app_group_delete')],
        ['/manage/app_simple_query', require('./manage/app_simple_query')],
        ['/manage/app_ext_query', require('./manage/app_ext_query')],
        ['/manage/app_group_name_verify', require('./manage/app_group_name_verify')],

        ['/manage/app_policy_query', require('./manage/app_policy_query')],
        ['/manage/theme_query', require('./manage/theme_query')],

        ['/mon/mon_data', require('./mon/mon_data')],
        ['/mon/host_monitor', require('./mon/host_monitor')],
        ['/mon/user_session_query', require('./mon/user_session_query')],
        ['/mon/app_inst_query', require('./mon/app_inst_query')],
        ['/mon/user_act_inst_query', require('./mon/user_act_inst_query')],
        ['/mon/websocket_addr_query', require('./mon/websocket_addr_query')],

        ['/statis/cycle', require('./statis/cycle')],
        ['/statis/user_statis', require('./statis/user_statis')],
        ['/statis/host_statis', require('./statis/host_statis')],
        ['/statis/app_statis', require('./statis/app_statis')],
        ['/statis/user_statis_max', require('./statis/user_statis_max')],

        ['/log/log_level_query', require('./log/log_level_query')],
        ['/log/log_event_query', require('./log/log_event_query')],
        ['/log/log_admin_query', require('./log/log_admin_query')],
        ['/log/log_admin_detail', require('./log/log_admin_detail')],
        ['/log/log_user_query', require('./log/log_user_query')],
        ['/log/log_user_detail', require('./log/log_user_detail')],
        ['/log/log_host_query', require('./log/log_host_query')],
        ['/log/log_host_detail', require('./log/log_host_detail')],
        ['/log/log_app_query', require('./log/log_app_query')],
        ['/log/log_app_detail', require('./log/log_app_detail')],
        ['/log/log_cloud_query', require('./log/log_cloud_query')],
        ['/log/log_cloud_detail', require('./log/log_cloud_detail')],

        ['/cfg/global', require('./cfg/global')],
        ['/cfg/global_modify', require('./cfg/global_modify')],

        ['/cfg/ws', require('./cfg/ws')],
        ['/cfg/ws_modify', require('./cfg/ws_modify')],

        ['/cfg/host', require('./cfg/host')],
        ['/cfg/host_modify', require('./cfg/host_modify')],

        ['/cfg/app_filter', require('./cfg/app_filter')],
        ['/cfg/app_filter_query', require('./cfg/app_filter_query')],
        ['/cfg/access_type', require('./cfg/access_type')],
        ['/cfg/access_type_modify', require('./cfg/access_type_modify')],
        ['/cfg/access_type_name_verify', require('./cfg/access_type_name_verify')],
        ['/cfg/user_access', require('./cfg/user_access')],
        ['/cfg/user_access_query', require('./cfg/user_access_query')],
        ['/cfg/user_access_modify', require('./cfg/user_access_modify')]
    ];

    return router_list;
}


exports.getUnless = function() {
    var unless = ['/', '/login','/logout', '/index', '/manage/license_gen', '/manage/license_query', '/manage/file_upload', '/mon/mon_data', '/mon/host_monitor'];
    return unless;
}