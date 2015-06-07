(function ($) {

function Slider (options) {
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

		var startX, startY, lastX, curX,
			scrolling, moveRead,
			el = me.options.el[0];

		el.addEventListener('touchstart', touchStart, false);
		el.addEventListener('touchmove', touchMove, false);
		el.addEventListener('touchend', touchEnd, false);
		el = null;

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
				this.style.webkitTransitionDuration = '0ms';
				this.style.webkitTransform = 'translateX(' + (curX + clientX - startX) + 'px)';
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

			this.style.webkitTransitionDuration = '350ms';
			this.style.webkitTransform = 'translateX(' + (-me.slideW * me.curIndex) + 'px)';
			console.log('call touchend');
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