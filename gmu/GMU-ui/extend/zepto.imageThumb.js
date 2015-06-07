(function ($) {

$.fn.imageThumb = function (options) {
	var defaults = {
		data: [],
		space: 4,
		className: 'thumb-lazyload',
		afterInit: function () {}
	};

	var params = $.extend({}, defaults, options || {});
	var $thumb = $(this);

	function thumber () {
		var thumbW = $thumb.width() || 320;

		return {
			init: function () {
				var html = '',
					data = params.data,
					s = params.space,
					c = params.className,
					W = thumbW - 3 * s,
					w1, h1, w2, h2, top,
					h, x1, x2,
					hArr = [],
					boxH = 0;

				for (var i = 0, len = data.length; i < len; i++) {
					if (i % 2 === 1) {
						w1 = data[i - 1].width;
						h1 = data[i - 1].height;
						w2 = data[i].width;
						h2 = data[i].height;
						x1 = Math.floor(W / (1 + (h1 * w2) / (h2 * w1)));
						x2 = W - x1;
						h = Math.floor((h1 * x1) / w1);
						html += '<li class="image-thumb-item" data-index="' + (i - 1) + '" '
								+ 'style="'
									+ 'top: ' + boxH + 'px; '
									+ 'left: ' + s + 'px; '
									+ 'width: ' + x1 + 'px; '
									+ 'height: ' + h + 'px; '
								+ '">'
									+ '<img '
										+ 'data-url="' + data[i - 1].url + '" '
										+ 'class="' + c + '" '
										+ 'style="'
											+ 'width: ' + x1 + 'px; '
											+ 'height: ' + h + 'px; '
									+ '">'
							+ '</li>'
							+ '<li class="image-thumb-item" data-index="' + i + '" '
								+ 'style="'
									+ 'top: ' + boxH + 'px; '
									+ 'left: ' + (x1 + s + s) + 'px; '
									+ 'width: ' + x2 + 'px; '
									+ 'height: ' + h + 'px; '
								+ '">'
									+ '<img '
										+ 'data-url="' + data[i].url + '" '
										+ 'class="' + c + '" '
										+ 'style="'
											+ 'width: ' + x2 + 'px;'
											+ 'height: ' + h + 'px;'
									+ '">'
							+ '</li>';
						boxH += h + s;
					}
				}
				// 若最后一张图片
				if (len % 2 === 1) {
					w1 = data[len - 1].width;
					h1 = data[len - 1].height;
					x1 = W + s;
					h = Math.floor((h1 * x1) / w1);
					html += '<li class="image-thumb-item" data-index="' + (len - 1) + '" '
							+ 'style="'
								+ 'top: ' + boxH + 'px; '
								+ 'left: ' + s + 'px; '
								+ 'width: ' + x1 + 'px; '
								+ 'height: ' + h + 'px; '
							+ '">'
								+ '<img data-url="' + data[len - 1].url + '" '
									+ 'class="' + c + '" '
									+ 'style="'
										+ 'width: ' + x1 + 'px; '
										+ 'height: ' + h + 'px; '
								+ '">'
						+ '</li>';

					boxH += h + s;
				}
				$thumb.height(boxH);
				$thumb.html(html);
				// params.afterInit();
				this.init = null;
			}
		}
	}

	var t = thumber();
	t.init();
	return t;
};

})(Zepto);