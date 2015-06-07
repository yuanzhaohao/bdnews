/*
* content: Zepto插件scrollLazyload.js
* author: yzh
* time: 2013-12-31 17:42
* parram: @attr: 'data-url' 图片url属性
*         @container: window, 添加事件的容器
*         @eventName: 'scroll', 绑定事件的方式
*         @effect: 'show', 图片效果
*         @effectTime: 350, 图片效果动画时间
*         @threshold: 0, 开始加载的距离
*         @placeholder: 'http://wap.baidu.com/static/news/webapp_lite/img/news_placeholder.png'
*                       图片显示前的占位符
* updete: 2013-12-31 20:42 目前只加了这么多参数，后面再根据需求进行扩展
*       : 2014-01-01 15:00 添加图片展示效果effect
*         2014-03-14 21:30 删除eventName参数；取消scroll节流
*         2014-03-16 23:32 添加是否节流boolean
*         2014-04-03 18:26 大调整吖，把这个插件重写了一下，去除原有的部分参数，只增加fadein
*                       节点的操作改成了replaceWidth，避免append进去的节点重复操作了
*
*/

;(function($) {
    $.fn.scrollLazyload = function (options) {
        var defaults = {
            attr: 'data-url',
            container: window,
            isFade: false,
            threshold: 0,
            isThrottle: false
        };

        var params = $.extend({}, defaults, options || {}),
            $container = $(params.container),
            arr = [];

        if ($(this).length === 0) {
            return;
        }

        $(this).each(function (index, el) {
            arr.push({
                $el: $(this),
                url: $(this).attr(params.attr),
                isLoading: false
            });
        });

        function loading () {
            if (!arr.length) {
                destroy();
                return;
            }
            $.each(arr, function (k, v) {
                var img;

                if (!!v.url && !v.isLoading) {
                    if (isInViewport(v.$el)) {
                        img = new Image();
                        img.src = v.url;
                        img.onload = function () {
                            v.$el
                                .trigger('loadComplete')
                                .replaceWith(img);

                            if (!!params.isFade) {
                                fadeIn(img);
                            }
                            img.onload = null;
                        }
                        v.isLoading = true;
                    }
                }
                else {
                    arr.splice(k, 1);
                }
            });
        }

        function throttleLoading () {
            throttle(loading);
        }

        function destroy () {
            if (params.isThrottle) {
                $container[0].removeEventListener('scroll', throttleLoading, false);
            }
            else {
                $container[0].removeEventListener('scroll', loading, false);
            }
            $container = arr = null;
        }

        function belowViewport ($el) {
            var fold = ($container[0] === 'undefined' || $container[0] === window)
                    ? window.innerHeight + window.scrollY
                    : $container.offset().top + $container.height();

            return fold <= $el.offset().top - params.threshold;
        }

        function rightViewport ($el) {
            var fold = ($container[0] === 'undefined' || $container[0] === window)
                    ? window.innerWidth + window.scrollX
                    : $container.offset().left + $container.width();

            return fold <= $el.offset().left - params.threshold;
        }

        function aboveViewport ($el) {
            var fold = ($container[0] === 'undefined' || $container[0] === window)
                    ? window.scrollY
                    : $container.offset().top;

            return fold >= $el.offset().top + params.threshold  + $el.height(); 
        }

        function leftViewport ($el) {
            var fold = ($container[0] === 'undefined' || $container[0] === window)
                    ? window.scrollX
                    : $container.offset().left;

            return fold >= $el.offset().left + params.threshold  + $el.width(); 
        }
        // 检测是否在可视范围内，包括上下左右四个方向
        function isInViewport ($el) {
            return !belowViewport.apply(this, arguments) && !rightViewport.apply(this, arguments)
                && !aboveViewport.apply(this, arguments) && !leftViewport.apply(this, arguments);
        }
        // 图片渐显效果
        function fadeIn (o) {
            o.style.opacity = 0;
            o.style.webkitTransitionDuration = '0ms';

            setTimeout(function () {
                o.style.opacity = 1;
                o.style.webkitTransitionDuration = '250ms';
            }, 0);
        }

        // 节流处理
        function throttle (method, context) {
            clearTimeout(method.tId);
            method.tId = setTimeout(function () {
                method.apply(context, arguments);
            }, 250);
        }

        $(document).ready(function () {
            loading();
            if (params.isThrottle) {
                $container[0].addEventListener('scroll', throttleLoading, false);
            }
            else {
                $container[0].addEventListener('scroll', loading, false);
            }
        });
        return this;
    };
})( Zepto );