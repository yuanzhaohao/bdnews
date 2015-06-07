(function ($) {

function Slider (options) {
	// var selector = '.' + params.itemclassName,
	// 	curIndex = params.startIndex,
	// 	len = params.data.length,
	// 	slideW;

	// var loadImg = function (i) {
	// 	var loadOneImg = function (k) {
	// 		if (params.data[k] !== null) {
	// 			if (!params.data[k].isLoading) {
	// 				var img = new Image(),
	// 					$item = params.el.children(selector).eq(k);

	// 				$item.html('图片正在加载...');
	// 				params.data[k].isLoading = true;
	// 				img.src = params.data[k].url;
	// 				img.onload = function () {
	// 					$item.html(img);
	// 					params.data[k] = null;
	// 					img.onload = null;
	// 					img = null;
	// 					$item = null;
	// 				};
	// 				img.onerror = function () {
	// 					$item.html('<span class="img-loaderror" '
	// 							+ 'data-url="' + data[k].url 
	// 						+ '">'
	// 							+ '图片加载失败，点击重新加载'
	// 						+ '</span>'
	// 					);
	// 					params.data[k].isLoading = false;
	// 					$item = null;
	// 				}
	// 			}
	// 		}
	// 	};

	// 	loadOneImg(i);
	// 	if (len > 1 && params.isLoadBeside) {
	// 		var prevIndex, nextIndex;

	// 		prevIndex = (i === 0)
	// 			? len - 1 
	// 			: i - 1,

	// 		nextIndex = (i + 1 === len) 
	// 			? 0 
	// 			: i + 1;

	// 		loadOneImg(prevIndex);
	// 		loadOneImg(nextIndex);
	// 	}
	// };

	// var changeIndex = function (i) {
	// 	curIndex = (i === 1) 
	// 		? curIndex - 1 
	// 		: curIndex + 1;
	// 	setTimeout(function () {
	// 		params.onAfterChange(curIndex);
	// 	}, 400);
	// };

	// var register = function () {
	// 	var startX, startY, lastX,
	// 		scrolling, moveRead

	// 	params.el[0].addEventListener('touchstart', touchStart, false);
	// 	params.el[0].addEventListener('touchmove', touchMove, false);
	// 	params.el[0].addEventListener('touchend', touchEnd, false);

	// 	function touchStart (e) {
	// 		e.preventDefault();
	// 		e.stopPropagation();
	// 		if (!e.touches.length) {
	// 			return;
	// 		}
	// 		var touch = e.touches[0];
	// 		startX = touch.clientX;
	// 		startY = touch.clientY;
	// 		curX = -slideW * curIndex;
	// 		scrolling = true;
	// 		moveRead = false;
	// 		touch = null;
	// 	}

	// 	function touchMove (e) {
	// 		if (!e.touches.length || !scrolling) {
	// 			return;
	// 		}
	// 		var touch = e.touches[0],
	// 			clientX = touch.clientX,
	// 			clientY = touch.clientY;

			
	// 		if (moveRead) {
	// 			lastX = clientX;
	// 			e.currentTarget.style.webkitTransform = 'translateX(' + (curX + clientX - startX) + 'px)';
	// 		}
	// 		else {
	// 			var changeX = Math.abs(touch.clientX - startX),
	// 				changeY = Math.abs(touch.clientY - startY);

	// 			if ((changeX / changeY) > 1) {
	// 				e.preventDefault();
	// 				e.stopPropagation();
	// 				moveRead = true;
	// 			}
	// 			else if (changeY > 5) {
	// 				scrolling = false;
	// 			}
	// 			changeX = null;
	// 			changeY = null;
	// 		}
	// 		touch = null;
	// 		clientX = null;
	// 		clientY = null;
	// 	}

	// 	function touchEnd (e) {
	// 		if (!lastX || !scrolling) {
	// 			return;
	// 		}
	// 		e.preventDefault();
	// 		scrolling = false;
	// 		var x = lastX - startX;
	// 		if (x > 50 && curIndex !== 0) {
	// 			changeIndex(1);
	// 			loadImg(curIndex);
	// 		}
	// 		else if (x < -50 && curIndex !== len - 1) {
	// 			changeIndex(-1);
	// 			loadImg(curIndex);
	// 		}

	// 		$(this).css({
	// 			'-webkit-transform': 'translateX(' + (-slideW * curIndex) + 'px)',
	// 			'-webkit-transition': '-webkit-transform 350ms cubic-bezier(0, 0, 0.25, 1)'
	// 		});
	// 		startX = lastX = null;
	// 		x = null;
	// 	}
	// };

	// var _resize = function() {
	// 	slideW = window.innerWidth;
	// 	params.el[0].style.webkitTransform = 'translateX(' + (-slideW * curIndex) + 'px)';
	// };

	// var registerWindow = function () {
	// 	var throttle = function(method, context) {
	// 		clearTimeout(method.tId);
	// 		method.tId = setTimeout(function() {
	// 			method.apply(context, arguments);
	// 		}, 250);
	// 	};

	// 	$(window).on('onorientationchange' in window 
	// 		? 'orientationchange' 
	// 		: 'resize', function (e) {
	// 			throttle(_resize);
	// 	});
	// };

	// return {
	// 	resize: function (i) {
	// 		params.el[0].style.webkitTransform = 'translateX(' + (-slideW * i) + 'px)';
	// 		loadImg(i);
	// 		curIndex = i;
	// 	},

	// 	init: function () {
	// 		// var html = '',
	// 		// 	i = data.length,
	// 		// 	className = params.itemclassName;

	// 		// while (i--) {
	// 		// 	html += '<li class="' + className + '"></li>';
	// 		// }
	// 		// $slide.append(html);
	// 		_resize();
	// 		loadImg(curIndex);
	// 		if (len > 1) {
	// 			register();
	// 		}
	// 		className = null;
	// 		html = null;
	// 		register = null;
	// 		this.init = null;
	// 	},

	// 	destroy: function () {
	// 		loadImg = null;
	// 		registerWindow = null;
	// 		_resize = null;
	// 	}
	// }

	var me = this,
		defaults = {
			data: [],
			startIndex: 0,
			isLoadBeside: true,
			isHandleResize: true,
			itemclassName: 'image-slide-item',
			itemSelector: '.image-slide-item',
			onAfterChange: function () {},
			onItemClick: function () {},
			onImgSuccess: function () {}
		};
	me.options = $.extend({}, defaults, options || {});
	me.curIndex = me.options.startIndex;
	me.len = me.options.data.length;
	me.slideW = window.innerWidth;
}

Slider.prototype = {
	constructor: Slider,

	init: function () {
		var me = this;

		me.resize(me.curIndex);
		me.loadImg(me.curIndex);
		if (me.len > 1) {
			me.register();
		}
		me.init = null;
	},

	resize: function (i) {
		var me = this;

		me.options.el[0].style.webkitTransform = 'translateX(' + (-me.slideW * i) + 'px)';
		me.loadImg(i);
		me.curIndex = i;
	},

	loadImg: function (i) {
		var me = this;

		loadOneImg(i);
		if (me.len > 1 && me.options.isLoadBeside) {
			var prevIndex, nextIndex;

			prevIndex = (i === 0)
				? me.len - 1 
				: i - 1,

			nextIndex = (i + 1 === me.len) 
				? 0 
				: i + 1;

			loadOneImg(prevIndex);
			loadOneImg(nextIndex);
		}

		function loadOneImg (k) {
			if (me.options.data[k] !== null) {
				if (!me.options.data[k].isLoading) {
					var img = new Image(),
						$item = me.options.el
							.children(me.options.itemSelector)
							.eq(k);

					me.options.data[k].isLoading = true;
					$item.html('图片正在加载...');
					img.src = me.options.data[k].url;
					img.onload = function () {
						$item.html(img);
						me.options.data[k] = null;
						img.onload = null;
						img = null;
						$item = null;
					};
					img.onerror = function () {
						$item.html('<span class="img-loaderror" '
								+ 'data-url="' + me.options.data[k].url 
							+ '">'
								+ '图片加载失败，点击重新加载'
							+ '</span>'
						);
						me.options.data[k].isLoading = false;
						$item = null;
					}
				}
			}
		}
	},

	register: function () {
		var me = this;

		var startX, startY, lastX,
			scrolling, moveRead

		me.options.el[0].addEventListener('touchstart', touchStart, false);
		me.options.el[0].addEventListener('touchmove', touchMove, false);
		me.options.el[0].addEventListener('touchend', touchEnd, false);

		function touchStart (e) {
			e.preventDefault();
			e.stopPropagation();
			if (!e.touches.length) {
				return;
			}
			var touch = e.touches[0];
			startX = touch.clientX;
			startY = touch.clientY;
			curX = -me.slideW * me.curIndex;
			scrolling = true;
			moveRead = false;
			touch = null;
		}

		function touchMove (e) {
			if (!e.touches.length || !scrolling) {
				return;
			}
			var touch = e.touches[0],
				clientX = touch.clientX,
				clientY = touch.clientY;

			
			if (moveRead) {
				lastX = clientX;
				e.currentTarget.style.webkitTransform = 'translateX(' + (curX + clientX - startX) + 'px)';
			}
			else {
				var changeX = Math.abs(touch.clientX - startX),
					changeY = Math.abs(touch.clientY - startY);

				if ((changeX / changeY) > 1) {
					e.preventDefault();
					e.stopPropagation();
					moveRead = true;
				}
				else if (changeY > 5) {
					scrolling = false;
				}
				changeX = null;
				changeY = null;
			}
			touch = null;
			clientX = null;
			clientY = null;
		}

		function touchEnd (e) {
			if (!lastX || !scrolling) {
				return;
			}
			e.preventDefault();
			scrolling = false;
			var x = lastX - startX;
			if (x > 50 && me.curIndex !== 0) {
				me.changeIndex(1);
				me.loadImg(me.curIndex);
			}
			else if (x < -50 && me.curIndex !== me.len - 1) {
				me.changeIndex(-1);
				me.loadImg(me.curIndex);
			}

			$(this).css({
				'-webkit-transform': 'translateX(' + (-me.slideW * me.curIndex) + 'px)',
				'-webkit-transition': '-webkit-transform 350ms cubic-bezier(0, 0, 0.25, 1)'
			});
			startX = lastX = null;
			x = null;
		}
	},

	changeIndex: function (i) {
		var me = this;

		me.curIndex = (i === 1) 
			? me.curIndex - 1 
			: me.curIndex + 1;

		setTimeout(function () {
			me.options.onAfterChange(me.curIndex);
		}, 400);
	}
};

$.fn.imageSlide = function (options) {
	options.el = this;
	var s = new Slider(options);
	s.init();
	return s;
};

})(Zepto);