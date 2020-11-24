/**
 * Created by fushou on 2019/3/21.
 */

;(function ($){

    /* 构造函数 */
    /*
    * param: {
    *   id: 1,
    *   width: 400,
    *   height: 300,
    *   data: [
    *      {
    *       id: 1,
    *       name: "mspaint",
    *       text: "画图",
    *       image:"http://localhost/images/app/paint.png",
    *       remark: "",
    *       user_data: ""
    *      },
    *      {
    *        id: 2,
     *       name: "notepad",
     *       text: "记事本",
     *       image:"http://localhost/images/app/noepad.png",
     *       remark: "",
     *       user_data: ""
    *      }
    *   ]
    * }
    * */
    function  selecter(root, params) {
        this.targetRoot = root;

        if (params.id == undefined) {
            alert('请输入组件ID参数');
        }

        this.param = this.param || {};

        this.param = $.extend(this.param, params);

        if (this.param.width == undefined || this.param.width < 200) {
            this.param.width = 400; // 400
        }
        if (this.param.height == undefined || this.param.height < 100) {
            this.param.height = 260; // 260
        }

        // 初始化显示参数
        var colums = Math.floor((this.param.width - 20) / 90); // 取整数
        var rows = Math.floor((this.param.height - 60) / 90);

        this.param.start_index = 0;
        this.param.max_count = rows * colums;

        this.initDom();
        this.initStatus();
        this.initHeadEvent();
        this.initBodyEvent();
    }

    /* 向对象添加属性或方法 */
    selecter.prototype.initDom = function() {
        var element_id = this.param.id;
        var width = this.param.width;
        var height = this.param.height;

        var innerHtml = '';

        var _self = document.getElementById(element_id);

        _self.style.width = width + 'px';
        _self.style.height = height + 'px';

        innerHtml += '<div class="self-selecter">';

        innerHtml += this.createHeadUI();

        innerHtml += this.createBodyUI(1);

        innerHtml += '</div>';

        _self.innerHTML += innerHtml;

    }

    selecter.prototype.initStatus = function() {
        var that = this;

        var prev_btn_id = that.getHeadPreBtnId();
        var next_btn_id = that.getHeadNextBtnId();

        var prev_btn = document.getElementById(prev_btn_id);
        var next_btn = document.getElementById(next_btn_id);

        if (prev_btn != undefined && next_btn != undefined) {
            var max_count = that.getMaxCount();
            var datas = that.getData();

            if (max_count >= datas.length) {
                // 隐藏翻页按钮
                $("#" + prev_btn_id).hide();
                $("#" + next_btn_id).hide();
            }
            else {
                $("#" + prev_btn_id).show();
                $("#" + next_btn_id).show();
            }
        }

    }

    selecter.prototype.initHeadEvent = function() {
        var that = this;

        var pre_btn_id = that.getHeadPreBtnId();
        var next_btn_id = that.getHeadNextBtnId();

        $("#" + pre_btn_id).click(function(e){
            // 上一页
            var start_index = that.getStartIndex();
            var max_count = that.getMaxCount();
            if (start_index >= max_count) {
                start_index -= max_count;

                that.setStartIndex(start_index);

                that.updateBodyData();
            }

        });

        $("#" + next_btn_id).click(function(e){
            // 下一页
            var start_index = that.getStartIndex();
            var max_count = that.getMaxCount();
            var datas = that.getData();

            start_index += max_count;
            if (start_index < datas.length) {
                that.setStartIndex(start_index);

                that.updateBodyData();
            }
        });

    }

    selecter.prototype.initBodyEvent = function() {
        var that = this;

        $(".self-selecter-wrap-item").click(function(e){
            // 单击数据项

            var root_id = that.getRootId();
            var item_root_id = $(this).attr("root-id");
            if (root_id == item_root_id) {
                var user_data = $(this).attr("user-data");
                // 调用回调函数
                var onclick_func = that.getClickCallback();
                if (onclick_func != undefined) {
                    onclick_func(user_data);
                }
            }

        });
    }

    selecter.prototype.createHeadUI = function() {
        var that = this;

        var innerHtml = '';

        innerHtml = '<div class="self-selecter-head" ';
        innerHtml += 'id="' + this.getHeadId() + '" ';
        innerHtml += '>';

        innerHtml += '<div class="self-selecter-row"';
        innerHtml += '>';

        innerHtml += '<input type="button" class="self-prev-btn" ';
        innerHtml += 'id="' + that.getHeadPreBtnId() + '" ';
        innerHtml += 'value="上一页" />';

        innerHtml += '<input type="button" class="self-next-btn" ';
        innerHtml += 'id="' + that.getHeadNextBtnId() + '" ';
        innerHtml += 'value="下一页" />';

        innerHtml += '</div>'; // end div self-selecter-row

        innerHtml += '</div>'; // end div self-selecter-head

        return innerHtml;
    }
    selecter.prototype.createBodyUI = function(has_data) {
        var that = this;

        var innerHtml = '';

        innerHtml = '<div class="self-selecter-body" ';
        innerHtml += 'id="' + that.getBodyId() + '" ';
        innerHtml += '>';

        if (has_data > 0) {
            var start_index = that.getStartIndex();
            var max_count = that.getMaxCount();
            var datas = that.getData();
            var bodyDataHtml = that.createBodyDataHtml(start_index, max_count, datas);
            innerHtml += bodyDataHtml;
        }

        innerHtml += '</div>';

        return innerHtml;
    }

    selecter.prototype.createBodyDataHtml = function(start_index, max_count, datas) {
        var that = this;

        var root_id = that.getRootId();

        var innerHtml = '';

        innerHtml += '<div class="self-selecter-wrap-frame"';
        innerHtml += '>';

        var end_index = start_index + max_count;
        if (end_index > datas.length) {
            end_index = datas.length;
        }

        for(var idx = start_index; idx < end_index; idx++) {
            var itemData = datas[idx];

            var item_id = itemData.id;
            var item_name = itemData.name;
            var item_text = itemData.text;
            var item_image = itemData.image;
            var item_remark = itemData.remark;
            var item_user_data = itemData.user_data;
            if (item_user_data == undefined) {
                item_user_data = '';
            }

            var itemHtml = '';
            // item
            itemHtml = '<div class="self-selecter-wrap-item" ';
            itemHtml += 'id="' + item_id + '" ';
            itemHtml += 'root-id="' + root_id + '" ';
            itemHtml += 'name="' + item_name + '" ';
            itemHtml += 'remark="' + item_remark + '" ';
            itemHtml += 'user-data="' + item_user_data + '" ';
            itemHtml += '>';

            // item image
            itemHtml += '<div class="self-selecter-wrap-item-img" ';
            itemHtml += '>';

            itemHtml += '<img src="' + item_image + '" >';

            itemHtml += '</div>'; // end div item image

            // item text
            itemHtml += '<div class="self-selecter-wrap-item-text" ';
            itemHtml += '>';

            itemHtml += item_text;

            itemHtml += '</div>'; // end div item text

            itemHtml += '</div>'; // end div item

            innerHtml += itemHtml;
        }

        innerHtml += '</div>';

        return innerHtml;
    }
    selecter.prototype.updateBodyData = function() {
        var that = this;

        var start_index = that.getStartIndex();
        var max_count = that.getMaxCount();
        var datas = that.getData();
        var body_id = that.getBodyId();

        var innerHtml = that.createBodyDataHtml(start_index, max_count, datas);

        // 更新数据
        $("#" + body_id).html(innerHtml);

        // 更新事件
        that.initBodyEvent();
    }

    selecter.prototype.getRootId = function() {
        return this.param.id;
    }

    selecter.prototype.getHeadId = function() {
        if (this.param.head_id == undefined) {
            this.param.head_id = this.param.id + '_head_id';
        }
        return this.param.head_id;
    }

    selecter.prototype.getBodyId = function() {
        if (this.param.body_id == undefined) {
            this.param.body_id = this.param.id + '_body_id';
        }
        return this.param.body_id;
    }

    selecter.prototype.getHeadPreBtnId = function() {
        if (this.param.head_pre_btn_id == undefined) {
            this.param.head_pre_btn_id = this.param.id + '_head_pre_btn_id';
        }
        return this.param.head_pre_btn_id;
    }

    selecter.prototype.getHeadNextBtnId = function() {
        if (this.param.head_next_btn_id == undefined) {
            this.param.head_next_btn_id = this.param.id + '_head_next_btn_id';
        }
        return this.param.head_next_btn_id;
    }

    selecter.prototype.getData = function() {
        return this.param.data;
    }

    selecter.prototype.getStartIndex = function() {
        return this.param.start_index;
    }

    selecter.prototype.setStartIndex = function(index) {
        this.param.start_index = index;
    }

    selecter.prototype.getMaxCount = function() {
        return this.param.max_count;
    }

    selecter.prototype.getClickCallback = function() {
        return this.param.onclick;
    }

    /* 向JQUERY对象添加自定义方法，立即执行函数 */
    $.fn.selecter = function(options) {
        var select = new selecter(this, options);
        return select;
        //return this.each(function(){
        //    new selecter(this, options)
        //})
    }

})(jQuery)
