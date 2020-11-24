/**
 * Created by fushou on 2018/7/18.
 */

function getImageSelectDialog() {
    var reqUrl = '/desk/image_list';
    var reqData = {};
    var rslt = '';

    reqData['all'] = 1;
    reqData['time'] = new Date().getTime(); // 强制请求远端服务器
    // 请求用户配置应用
    $.get(reqUrl, reqData, function (data) {
        var status = data['status'];
        if (status != 1) {
            return;
        }

        // 解析应用列表
        var list = data['list'];
        if (list && list.length > 0) {
            var max_w = getInnerWidth();
            var max_h = getInnerHeight();
            var img_w = 80; //getDeskAppWidth();
            var img_h = 80; //getDeskAppHeight();

            var tb_max_w = max_w - 20;
            tb_max_w = tb_max_w < 400 ? 400 : tb_max_w;
            var tb_w = parseInt(tb_max_w - 40);

            var tb_columns = (parseInt(tb_w / img_w) - 1);
            var tb_rows = Math.ceil(list.length / tb_columns);
            var tb_h = (tb_rows * img_h + 20);

            // 模态图标对话框窗口
            var img_select = document.getElementById('image_select_id');
            img_select.style.width = tb_max_w + 'px';
            img_select.style.overflow = 'auto';

            // 创建表格
            var img_tb = OnImageTableCreate('tb_image_list', tb_rows, tb_columns, tb_w, tb_h, img_w, img_h);
            if (img_tb == undefined) {
                return;
            }

            for(var idx = 0; idx < list.length; idx++) {
                var item_node = list[idx];
                if (!item_node)
                    continue;

                var itemId = item_node['id'];
                var itemRFolder = item_node['rfolder'];
                var itemFileName = item_node['file_name'];
                var itemText = item_node['text'];
                //var itemWidth = item_node['width'];
                //var itemHeight = item_node['height'];
                //var itemTarget = item_node['target'];
                //var itemEnable = item_node['enable'];
                //var itemRemark = item_node['remark'];
                var row_idx = 0;
                var column_idx = 0;

                // 横向填充
                row_idx = parseInt(idx / tb_columns);
                column_idx = idx % tb_columns;

                var td_id =OnGetTdId(row_idx, column_idx);

                var itemIcon = '../' +  itemRFolder + '/' + itemFileName;
                var td_innerHtml = '';
                td_innerHtml += '<img src="' + itemIcon + '">';
                td_innerHtml += '<br />';
                td_innerHtml += '<span>' + itemText + '</span>';
                td_innerHtml += '<br />';
                td_innerHtml += '<input type="radio" name="image_item_select" ';
                if (idx == 0) {
                    td_innerHtml += 'checked="checked" ';
                }
                td_innerHtml += '/>';

                var td_item_image_attr = itemRFolder + '/' + itemFileName;
                $('#' + td_id).html(td_innerHtml);
                $('#' + td_id).attr('item_image', td_item_image_attr);

            }

            $("#tb_image_list td").hover(function(){
                // in
                // 进入的时候添加背景色
                var tb_text = $(this).text();
                if (tb_text != undefined && tb_text.length > 0) {
                    $(this).css("background-color", "#5caae8");
                    //$(this).css("behavior", "url(third_part/css3/ie-css3.htc)");
                }
            }, function(){
                // out
                // 离开的时候清空背景色
                $(this).css("background-color", "");
                //$(this).css("behavior", "url(third_part/css3/ie-css3.htc)");
            })
        }

    });
}

function getImageSelectCommit() {
    var rslt = '';
    // 获取选中radio的项
    $('input:radio:checked').each(function(){
        rslt = $(this).parent().attr('item_image');
    })

    if (rslt.length > 0) {
        document.getElementById('app_image').value = rslt;
        // 隐藏模态窗口
        $("#image_select_dialog").modal('hide');
    }
}
