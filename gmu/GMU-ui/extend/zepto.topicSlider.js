(function ($) {
	$.fn.topicSlider = function (options) {
		var defaults = {
			itemSelector: '.topic-gallery-item',
			iconSelector: '.topic-gallery-icons',
			startIndex: 0,
			iconCurClass: 'cur',
			onItemClick: function () {},
			onAfterChange: function () {}
		};

		var params = $.extend({}, defaults, options || {});
		var $list = $(this);
		function slider() {
			var $iconContainer = $list.siblings(params.iconSelector),
				$items = $list.children(params.itemSelector),
				startX = 0,
				startY = 0,
				lastX = 0,
				curX,
				listW = $list.width() - parseInt($items.eq(0).css('margin-left'), 10),
				curIndex = params.startIndex,
				len = Math.ceil(
					$items.length / 2
				),
				selector = params.itemSelector;
				
			var move = function (i) {
				curIndex = (i === 1) 
					? curIndex - 1 
					: curIndex + 1;
				setTimeout(function () {
					$iconContainer.find('i')
						.eq(curIndex)
						.addClass(params.iconCurClass)
						.siblings('i')
						.removeClass(params.iconCurClass);
					params.onAfterChange(curIndex);
				}, 400);
			};

			var registerTouch = function () {
				$list
					.on('touchstart', selector, function (e) {
						startX = lastX = e.touches[0].clientX;
						startY = e.touches[0].clientY;
						curX = -listW * curIndex;
						e.preventDefault();
					})
					.on('touchmove', selector, function (e) {
						var clientX = e.changedTouches[0].clientX,
							x = clientX - lastX;
						if (x !== 0) {
							lastX = clientX;
							curX += x;
							$list[0].style.webkitTransform = 'translateX(' + curX + 'px)';
							e.preventDefault();
						}
					})
					.on('touchend', selector, function (e) {
						var x = e.changedTouches[0].clientX - startX,
							y = e.changedTouches[0].clientY - startY;

						if (x === 0 && y === 0) {
							params.onItemClick($(this));
							return;
						}
						if (x > 50 && curIndex !== 0) {
							move(1);
						}
						if (x < -50 && curIndex !== len - 1) {
							move(-1);
						}
						var x = -listW * curIndex;
						setTimeout(function () {
							$list.css({
								'-webkit-transform': 'translateX(' + x + 'px)',
								'-webkit-transition': '-webkit-transform 350ms cubic-bezier(0, 0, 0.25, 1)'
							});
						}, 0);
						startX = lastX = curX = null;
						e.preventDefault();
					});
			};

			var registerClick = function () {
				$list.on('click', selector, function (e) {
					params.onItemClick($(this));
					e.preventDefault();
				});
			};

			return {
				init: function () {
					var len = i = Math.ceil(
						$list.children(params.itemSelector).length / 2
					);
					while (i--) {
						$iconContainer.append('<i></i>');
					}
					$iconContainer.find('i')
						.eq(params.startIndex)
						.addClass(params.iconCurClass);

					if (len > 1) {
						registerTouch();
					} else {
						registerClick();
					}
					registerTouch = null;
					registerClick = null;
					this.init = null;
				},
				destroy: function () {
					$items.off();
					$items = null;
					$iconContainer = null;
					move = null;
				}
			};
		}

		var s = slider();
		s.init();
	}
})(Zepto, window);