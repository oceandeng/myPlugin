/* 
* @Author: ocean
* @Date:   2015-09-23 15:08:54
* @Last Modified by:   web
* @Last Modified time: 2016-11-02 14:54:11
*/

'use strict';

(function($){

// 配置项
    var defaultSet = {
        width: '',
        height: '',
        lock: true
    };
// 加载
    var load = loading({
        'width': 5,
        'height': 20
    });
// 工具函数
    function getX(e) {
        e = e || window.event;
        var _left = document.documentElement.scrollLeft || document.body.scrollLeft;
        return e.pageX || e.clientX + _left;
    };

    function getY(e) {
        e = e || window.event;
        var _top = document.documentElement.scrollTop || document.body.scrollTop;
        return e.pageY || e.clientY + _top;
    };

    function emptyArray(arr){
        arr.splice(0,arr.length);
        return arr;
    }

// 插件核心
    $.fn.lightBox = function(config){
        var config = $.extend({}, defaultSet, config);
        var $_this = $(this);

        return $_this.each(function(k, v){
            var $_this = $(v);

            var imgArr = [];
            var $showImg = $_this.find('img');

            $_this.on(config.cEvent, '.p-img-box img', function(){

                emptyArray(imgArr);

                var $__this = $(this);
                var index = $__this.parents(config.parentClass).index();

                $showImg = $_this.find('.p-img-box').find('img');

                var len = $showImg.size();

                $showImg.each(function(i, value){

                    var image = new Image();
                    image.src = $(value).attr('data-bsrc');
                    imgArr.push(image);

                    if(len == imgArr.length){
                        new DialogImg(index, config, imgArr);
                    }

                });

            });
        
        });
    };

// 弹出类
    function DialogImg(i, config, imgArr){
        this.index = i;
        this.config = config;
        this.imgArr = imgArr;
        this.config_onClose = typeof config.onClose == "function" ? configo.onClose : function() {
            return true
        };
        this.ulLeft = 0,
        this.startPos = {},
        this.movePos = {},
        this.endPos = {},
        this.left = false,
        this.right = false,

        this.init();
    }

    DialogImg.prototype.init = function(){
        this.ceateDom();
        this.createDots();
        this.setStyle();
        this.position();
        this.slideEvent();
        this.dialogEvent();
    };
// 创建DOM
    DialogImg.prototype.ceateDom = function(){
        var parent = document.createElement("div"),
            shade = document.createElement("div"),
            content = document.createElement("div"),
            head = document.createElement("div"),
            body = document.createElement("div"),
            page_body = document.getElementsByTagName("body")[0];

        parent.className = 'D_content';
        content.className = 'D_content';
        body.className = 'D_body';

        if(this.config.lock){
            shade.className = 'D_shade';
            parent.appendChild(shade);
        }

        var html = '';

        html += '<ul id="imgList">';
        for(var i = 0; i < this.imgArr.length; i++){
            html += '<li><img src="' + this.imgArr[i].src + '" alt="" /></li>';
        }
        html += '</ul>';

        body.innerHTML = html;
        content.appendChild(body);
        parent.appendChild(content);

        this.img = body.querySelectorAll('img');
        this.parent = parent;
        this.content = content;
        this.shade = shade;

        page_body.appendChild(parent);

        load.start();

        this.img[this.index].onload = function(){
            load && load.close();
        }
        this.img[this.index].onerror = function(){
            load && load.close();
        }

        this.ulWidth = this.imgArr.length * this.config.width ;
        this.ulLeft = -this.index * this.config.width;
        this.$imgList = $(this.content).find('#imgList');

    }
// 创建图片点
    DialogImg.prototype.createDots = function(){
        var foot = document.createElement("div");

        foot.className = 'D_foot';

        var foot_html = '';
        for(var i = 0; i < this.imgArr.length; i++){
            foot_html += '<span></span>'
        }

        foot.innerHTML = foot_html;
        this.content.appendChild(foot);
        this.foot = foot;
        this.$dots = $(this.foot).find('span');

    }
// 设置样式
    DialogImg.prototype.setStyle = function(){
        var _this = this;

        $(_this.content).css({
            'width': _this.config.width,
            'height': _this.config.height,
            'position': 'fixed',
            'z-index': 1000,
            'top': 0,
            'overflow': 'hidden'
        });

        $(_this.shade).css({
            'width': _this.config.width,
            'height': _this.config.height,
            'background': 'rgba(0, 0, 0, .9)',
            'position': 'fixed',
            'z-index': 999,
            'top': 0
        });

        this.$imgList.css({
            'margin': 0,
            'padding': 0,
            'width': this.ulWidth,
            'height': this.config.height,
            'overflow': 'hidden',
            'list-style-type': 'none',
            'position': 'absolute',
            'left': this.ulLeft
        });
        this.$imgList.find('li').css({
            'width': this.config.width,
            'height': this.config.height,
            'float': 'left',
            'text-align': 'center'
        });

        $(this.foot).css({
            'position': 'absolute',
            'bottom': '10px',
            'text-align': 'center',
            'width': '100%'
        });
        $(this.foot).find('span').css({
            'display': 'inline-block',
            'width': '8px',
            'height': '8px',
            'background': 'rgba(255, 255, 255, .6)',
            'margin': '0 3px',
            'border-radius': '100%'
        });
        this.$dots.eq(this.index).css({
            'background': '#e94331'
        });
    }
// 设置图片显示样式
    DialogImg.prototype.position = function(){
        
        var _this = this;
        var $imgListImg = this.$imgList.find('img');

        $imgListImg.each(function(index, value){
            var $__this = $(this);
            var image = new Image();

            image.onload = function(){
                var imgW = image.width;
                var imgH = image.height;
                var ratio = imgW / imgH;
                var naturalH = parseInt(_this.config.width / ratio);

                if(naturalH < _this.config.height){
                    $__this.css({
                        'margin-top': (_this.config.height - naturalH) / 2
                    });
                }
                if(imgH < naturalH){
                    $__this.css({
                        'margin-top': (_this.config.height - imgH) / 2
                    });
                }
                if(naturalH > _this.config.height){
                    $__this.css({
                        'height': _this.config.height,
                        'margin': 0
                    });
                }

            }

            image.src = $__this.attr('src');

        });

    }
// 图片滑动效果
    DialogImg.prototype.slideEvent = function(){
        var _this = this;

        this.$imgList.on('touchstart', function(e){
           _this.touchStart.call(_this, e);
        });
        this.$imgList.on('touchmove', function(e){
            _this.touchMove.call(_this, e);
        });
        this.$imgList.on('touchend', function(e){
            _this.touchEnd.call(_this, e);
        });
    }

    DialogImg.prototype.touchStart = function(event){
        var s = event.changedTouches[0];
        var ulLeft = parseInt(this.$imgList.css('left'));

        this.startPos = {
            x: s.clientX,
            y: s.clientY,
            oLeft: ulLeft
        }

    }

    DialogImg.prototype.touchMove = function(event){
        var s = event.changedTouches[0];

        this.movePos = {
            x: s.clientX,
            y: s.clientY
        }

        this.ulLeft = this.startPos.oLeft - (this.startPos.x - this.movePos.x);

        if(this.ulLeft > 0){
            this.ulLeft = 0;
        }

        if(-this.ulLeft > (this.ulWidth - this.config.width)){
            this.ulLeft = -(this.ulWidth - this.config.width);
        }

        this.$imgList.css({
            left: this.ulLeft
        });

        event.preventDefault();
    }

    DialogImg.prototype.touchEnd = function(event){
        var s = event.changedTouches[0];

        this.endPos = {
            x: s.clientX,
            y: s.clientY
        }

        var critical = parseInt(this.config.width / 4);
        var moveDir = this.startPos.x - this.endPos.x;
        var moveVal = Math.abs(moveDir);


        moveDir > 0 ? this.left = true : this.left = false;
        moveDir < 0 ? this.right = true : this.right = false;

        if(moveVal > critical && this.left){
            this.index += 1;

            if(this.index >= (this.imgArr.length - 1)){
                this.index = this.imgArr.length - 1;
            }
        }
        if(moveVal > critical && this.right){
            this.index -= 1;

            if(this.index <= 0){
                this.index = 0;
            }
        }

        this.$dots.css({
            'background': 'rgba(255, 255, 255, .6)'
        });
        this.$dots.eq(this.index).css({
            'background': '#e94331'
        });

        this.go(this.index);
    }

    DialogImg.prototype.go = function(index){
        this.$imgList.animate({
            left: -index * this.config.width
        }, 100);
    }

    DialogImg.prototype.dialogEvent = function(){
        var _this = this;

        // $(this.shade).on('tap', function(){
        $(_this.content).find('#imgList').find('li').on('tap', function(){
            _this.close();
        });
    }

    DialogImg.prototype.close = function(){
        // if (this.config_onClose(this) !== false) {
            this.remove();
        // }
    }

    DialogImg.prototype.remove = function(){
        var elem = this.content;

        removeDOM(elem.parentNode);
    }

    function removeDOM(elem) {
        // var animationElem = getElementsByClassName("D_content", "div", elem)[0],
            // outAnimation = animationElem.getAttribute("data-outanimation"),
        var events = ["animationend", "webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend"];
        // if (!outAnimation) {
        elem.parentNode.removeChild(elem);
        // } else {
        //     animationElem.className += " " + outAnimation;
        //     for (var i = 0; i < events.length; i++) {
        //         animationElem.addEventListener(events[i], function() {
        //             elem.parentNode.removeChild(elem);
        //         });
        //     }
        // }
    };

})(Zepto);