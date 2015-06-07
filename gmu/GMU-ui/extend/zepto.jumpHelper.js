/*
 * description: 一个简单的返回顶部插件
 * author: yzh
 * time: 2014-02-27 10:00
 * @param1: 时间戳
 * @param2: 回调函数，用于添加统计
*/
(function ($) {
	$.fn.jumpHelper = function (options) {
		var defaults = {
			timeId: 1000,
			className: 'ui-jumphelper',
			onJumpTop: function() {},
			onJumpBottom: function() {}
		};

		var params = $.extend({}, defaults, options || {});
		var $jump = $(this);

		function jump() {
			var register = function () {
				var gotopTimeOut;

				window.addEventListener('touchstart', jumpHide);
				window.addEventListener('scroll', scroll);

				$jump
					.on('touchstart', '#gotop', function (e) {
						window.scrollTo(0, 0);
						e.stopPropagation();
					})
					.on('touchstart', '#gobot', function (e) {
						window.scrollTo(0, document.body.scrollHeight);
						e.stopPropagation();
					})
					.on('touchend', function (e) {
						setTimeout(function () {
							$jump.hide();
						}, 150);
						e.stopPropagation();
					});

				function scroll() {
					clearTimeout(gotopTimeOut);
					gotopTimeOut = setTimeout(function() {
						if (document.body.scrollHeight !== (window.pageYOffset + window.innerHeight)
						&& window.pageYOffset > $(window).height()) {
							$jump.show();
						}
					}, params.timeId);
				}

				function jumpHide (e) {
					$jump.hide();
				}

				function throttle(method, context) {
					clearTimeout(method.tId);
					method.tId = setTimeout(function() {
						method.apply(context, arguments);
					}, 250);
				}
			};
			return {
				init: function () {
					!$jump.hasClass(params.className) && $jump.addClass(params.className);
					$jump.html('<span id="gotop">∧</span><span id="gobot">∨</span>');
					register();
					register = null;
				}
			};
		}

		var j= jump();
		j.init();
		j = null;
	};
})(Zepto);