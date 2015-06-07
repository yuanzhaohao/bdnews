(function ($) {

rocket.subview.index_header_nav = rocket.subview.extend({

	className: 'nav-box',

	template: _.template($('#template_index_nav').text()),

	events: {
		'click .nav-item': 'onItemClick',
		'click .nav-btn': 'onBtnClick',
		'click .nav-overlay': 'hideSubscribe',
		'click .nav-subscribe-item': 'onSubscribeItemClick',
		'click .nav-subscribe-manage': 'onSubscribeManageClick'
	},

	init: function (options) {
		var me = this;

		me.tagName = options.name || '';
		me.tagType = options.type || '';
		me.model = rocket.tags.newsTag;
		me.isLogin = window.bdnews.login.isLogin();
		me.isFirstRender = true;
		if (!me.isLogin) {
			me.tags = me.model;
			me.render();
		}
		else if (!!me.model.toJSON().data) {
			me.tags = me.model.toJSON().data.tag;
			me.render();
		}
		else {
			me.isFetchData = true;
		}
	},

	render: function () {
		var me = this;

		if (me.isFirstRender) {
			var tags = (me.isFetchData)
				? me.model.toJSON().data.tag
				: me.tags;
			
			me.isFirstRender = false;
			me.tags = tags;

			me.$el.html(
				me.template({
					tags: tags,
					isLogin: me.isLogin
				})
			);
			me.show();

			setTimeout(function () {
				me.$btn = me.$('.nav-btn');
				me.$inner = me.$('.nav-inner');
				me.$subscribe = me.$('.nav-subscribe');
				me.$overlay = me.$('.nav-overlay');
				me.$subscribeList = me.$('.nav-subscribe-list');
				me.isShowSubscribe = false;

				me.$subscribe[0].addEventListener('touchmove', function (e) {
					e.preventDefault();
				}, false);

				me.touchNav();
			}, 100);
		}
	},

	registerEvents: function () {
		var me = this;

		if (me.isLogin) {
			me.model.on('change', me.render, me);
		}
	},

	unregisterEvents: function () {
		var me = this;

		if (me.isLogin) {
			me.model.off('change', me.render, me);
		}
	},

	touchNav: function () {
		var me = this,
			$list = me.$('.nav-list'),
			$last = me.$('.nav-item').last(),
			$curTip = me.$('.nav-current'),
			$curItem = me.$('.nav-item').eq(0),
			maxTipEl = me.$('.nav-left-shadow')[0],
			minTipEl = me.$('.nav-right-shadow')[0],
			boxWidth = $list.width(),
			boxLeft = me.$('.nav-list').offset().left,
			maxDist = 0,
			minDist = boxWidth 
				- ($last.offset().left + $last.width()) 
				+ boxLeft;

		var nav = $list.touchScroll({
			isCrosswise: true,
			minDist: minDist,
			maxDist: maxDist,
			onInit: function () {
				setTimeout(function () {
					slide();
				}, 200);

				rocket.navSlide.newsSlide = slide;
				me.slide = slide;
			},
			onCheck: function () {
				window.bdnews.helper.throttle(check, me, 300, arguments);
			}
		});

		function slide ($item) {
			var dist, w, d, l;

			if (!$item) {
				var $items = me.$('.nav-item');

				var tagName = me.tagName,
					tagType = me.tagType;

				$item = $items.eq(0);
				$items.each(function (index, el) {
					if (tagName === encodeURIComponent($(this).data('name'))
						&& tagType === $(this).data('type')) {
						$item = $(this);
					}
				});
			}

			w = $item.width();
			dist = d = nav.getDist();
			l = $item.offset().left - boxLeft;

			dist = d + boxWidth / 2 - w / 2 - l;

			if (Math.abs(d + l) < boxWidth) {
				dist = d;
			}

			if (dist >= maxDist) {
				dist = maxDist;
			}
			else if (dist <= minDist) {
				dist = minDist;
			}

			setTimeout(function () {
				$list[0].style.webkitTransitionDuration = '0ms';
				$list[0].style.webkitTransform = 'translateX(' + dist + 'px)';

				$curTip
					.show()
					.width(w)
					.css({
						'-webkit-transform': 'translateX(' 
							+ ($item.offset().left - boxLeft - dist) 
							+ 'px)',
						'-webkit-transition-duration': '200ms'
					});
			}, 0);
			$curItem.removeClass('nav-item-focus');
			$item.addClass('nav-item-focus');
			$curItem = $item;
			check(dist >= maxDist, dist <= minDist);
			nav.setDist(dist);
		}

		function check () {
			maxTipEl.style.display = (arguments[0]) ? 'none' : 'block';
			minTipEl.style.display = (arguments[1]) ? 'none' : 'block';
		}
	},

	showSubscribe: function () {
		var me = this,
			speed = 300,
			h;

		if (!me.isShowSubscribe) {
			me.$inner.hide();
			me.$subscribe.show();

			if (!me.subscribeListHeight) {
				me.subscribeListHeight = me.$subscribeList.height() + 7;
			}
			h = me.subscribeListHeight;

			me.$btn.css({
				'-webkit-transform': 'rotateZ(0deg)',
				'-webkit-transition': '0ms'
			});
			me.$subscribeList.css({
				'height': '0px',
				'-webkit-transition': '0ms'
			});

			setTimeout(function () {
				me.$btn.css({
					'-webkit-transform': 'rotateZ(180deg)',
					'-webkit-transition': speed + 'ms'
				});
				me.$subscribeList.css({
					'height': h + 'px',
					'-webkit-transition': speed + 'ms'
				});
			}, 0);

			setTimeout(function () {
				me.$overlay.show();
				me.isShowSubscribe = true;
			}, speed);
		}
	},

	hideSubscribe: function () {
		var me = this,
			speed = 300,
			h = me.subscribeListHeight;

		if (me.isShowSubscribe) {
			me.$btn.css({
				'-webkit-transform': 'rotateZ(180deg)',
				'-webkit-transition': '0ms'
			});
			me.$subscribeList.css({
				'height': h + 'px',
				'-webkit-transition': '0ms'
			});
			me.$overlay.hide();

			setTimeout(function () {
				me.$btn.css({
					'-webkit-transform': 'rotateZ(0deg)',
					'-webkit-transition': speed + 'ms'
				});
				me.$subscribeList.css({
					'height': '0px',
					'-webkit-transition': speed + 'ms'
				});
			}, 0);

			setTimeout(function () {
				me.$inner.show();
				me.$subscribe.hide();
				me.$subscribeList.css({
					'height': h + 'px',
					'-webkit-transition': '0ms'
				});
				me.isShowSubscribe = false;
			}, speed);
		}
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			route;

		window.scrollTo(0, 0);
		if (!$el.hasClass('nav-item-focus')) {
			route = [
				'#index',
				encodeURIComponent($el.data('type')),
				encodeURIComponent($el.data('name')),
				encodeURIComponent($el.data('id'))
			].join('/');
			me.navigate(route);
			me.slide($el);
		}
	},

	onBtnClick: function (e) {
		var me = this;

		me.showSubscribe();
		me.hideSubscribe();
	},

	onSubscribeItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			$item = me.$('.nav-item').eq($el.data('index')),
			route;
			
		me.hideSubscribe();
		setTimeout(function () {
			if (!$item.hasClass('nav-item-focus')) {
				route = [
					'#index',
					encodeURIComponent($el.data('type')),
					encodeURIComponent($el.data('name')),
					encodeURIComponent($el.data('id'))
				].join('/');
				me.navigate(route);
				me.slide($item);
			}
		}, 300);
	},

	onSubscribeManageClick: function () {
		this.navigate('#subscribe');
	}
});

})(Zepto);