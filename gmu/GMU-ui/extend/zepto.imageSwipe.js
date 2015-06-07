(function ($) {

function Swipe (options) {
	'use strict';

	var noop = function () {};
	var offloadFn = function (fn, s) { setTimeout(fn || noop, s || 0) };

	var defaults = {
			data: [],
			startIndex: 0,
			speed: 350,
			autoTime: 4500,
			isLoadBeside: true,
			isHandleResize: true,
			isLoadImg: true,
			itemclassName: 'image-slide-item',
			itemSelector: '.image-slide-item',
			onAfterChange: function () {},
			onItemClick: function () {},
			onImgSuccess: function () {}
		};

	var options = $.extend({}, defaults, options || {}),
		$items,
		index, len, el, width, speed, pos;

	function init () {
		$items = options.el.children(options.itemSelector);
		el = options.el[0];
		width = el.offsetWidth;
		len = options.data.length;
		speed = options.speed || 350;
		slide(options.startIndex, speed);
		if (len > 1) {
			el.addEventListener('touchstart', eventHandler, false);
			el.addEventListener('webkitTransitionEnd', eventHandler, false);
		}
	}

	function circle (i) {
		return (len + (i % len)) % len;
	}

	function prev () {
		slide(circle(index - 1));
	}

	function next () {
		slide(circle(index + 1));
	}

	function slide (to, slideSpeed) {
		var dist = -width * to;

		// 必须立刻执行，否则性能会差很多
		offloadFn(move(dist, slideSpeed));
		if (index === to) {
			return;
		}
		pos = dist;
		index = to;
		if (options.isLoadImg) {
			loadImg();
		}
		offloadFn(function () {
			options.onAfterChange(to); 
		}, slideSpeed + 20);
	}

	function move (dist, moveSpeed) {
		el.style.webkitTransitionDuration = moveSpeed + 'ms';
		el.style.webkitTransform = 'translateX(' + dist + 'px)';
	}
	
	function loadImg () {
		loadOneImg(index);
		if (len > 1 && options.isLoadBeside) {
			loadOneImg(circle(index - 1));
			loadOneImg(circle(index + 1));
		}
	}

	function loadOneImg (k) {
		// if (options.data[k] !== null) {
			if (!options.data[k].isLoading) {
				var img = new Image();

				options.data[k].isLoading = true;
				img.src = options.data[k].url;
				img.onload = function () {
					$items.eq(k).html(img);
					// options.data[k] = null;
					options.data[k].isLoading = false;
					img.onload = null;
					img = null;
				};
				img.onerror = function () {
					$items.eq(k).html('<span class="img-loaderror" '
							+ 'data-url="' + options.data[k].url 
						+ '">'
							+ '图片加载失败，点击重新加载'
						+ '</span>'
					);
					options.data[k].isLoading = false;
					img.onerror = null;
					img = null;
				}
			}
		// }
	}

	// 自动滚动
	var delay = typeof options.autoTime === 'number'
			? options.autoTime
			: 0,
		timer;

	function begin () {
		if (delay !== 0) {
			timer = setTimeout(next, delay);
		}
	}

	function stop () {
		if (delay !== 0) {
			clearTimeout(timer);
		}
	}	

	// 处理事件
	var start = {},
		delta = {},
		isScrolling;

	var eventHandler = {
		handleEvent: function (e) {
			switch (e.type) {
				case 'touchstart': 
					this.start(e);
					break;
				case 'touchmove': 
					this.move(e);
					break;
				case 'touchend':
					offloadFn(this.end(e));
					break;
				case 'webkitTransitionEnd':
					offloadFn(this.transitionEnd(e));
					break;
			}
			if (options.stopPropagation) {
				e.stopPropagation();
			}
		},

		start: function (e) {
			var touch = e.touches[0];

			start = {
				x: touch.pageX,
				y: touch.pageY,
				time: +new Date
			};

			isScrolling = undefined;
			delta = {};
			el.addEventListener('touchmove', this, false);
			el.addEventListener('touchend', this, false);
		},

		move: function (e) {
			if (e.touches.length > 1 
				|| e.scale
					&& e.scale !== 1) {
				return;
			}
			stop();

			var touch = e.touches[0];
			delta = {
				x: touch.pageX - start.x,
				y: touch.pageY - start.y
			}

			if (typeof isScrolling === 'undefined') {
				isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
			}

			if (!isScrolling) {
				e.preventDefault();
				delta.x = delta.x / (
					(index === 0 && delta.x > 0
					 || index === len - 1 && delta.x < 0)
						? Math.abs(delta.x) / width * 2 + 1
						: 1
					);

				move(pos + delta.x, 0);
			}
			touch = null;
		},

		end: function (e) {
			if (!e.changedTouches.length || !delta.x) {
				return;
			}
			
			var duration = +new Date - start.time,
				isValidSlide = 
					Number(duration) < 250 
						&& Math.abs(delta.x) > 20
					|| Math.abs(delta.x) > 70,
				isPastBounds = 
					index === 0 && delta.x > 0
					|| index === len - 1 && delta.x < 0,
				direction = delta.x < 0;

			if (!isScrolling) {
				e.preventDefault();
				var to = index;
				if (!isPastBounds && isValidSlide) {
					if (direction) {
						to = circle(to + 1);
					}
					else {
						to = circle(to - 1);
					}
				}
				offloadFn(slide(to, speed));
			}
			el.removeEventListener('touchmove', this, false);
			el.removeEventListener('touchend', this, false);
		},

		transitionEnd: function (e) {
			begin();
		}
	};

	return {
		init: function () {
			init();
			init = null;
			this.init = null;
		},

		slide: function (to, speed) {
			stop();
			slide(to, speed);
		},

		prev: function () {
			stop();
			prev();
		},

		next: function () {
			stop();
			next();
		},

		getIndex: function () {
			return index;
		},

		destroy: function () {
			el.removeEventListener('touchstart', eventHandler, false);
			el.removeEventListener('touchmove', eventHandler, false);
			el.removeEventListener('touchend', eventHandler, false);
			el.removeEventListener('webkitTransitionEnd', eventHandler, false);
			this.slide = null;
			this.prev = null;
			this.next = null;
			this.getIndex = null;
		}
	}
}

$.fn.imageSwipe = function (options) {
	options.el = this;
	var s = Swipe(options);
	s.init();
	return s;
};

})(Zepto);