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
		me.activeCls = 'nav-item-focus';
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
				me.$items = me.$('.nav-item');
				me.isShowSubscribe = false;
				new YScroll(me.$inner[0]);
				me.$cur = me.$items[0];
				$.each(me.$items, function (index, item) {
					var $el = $(item),
						type = $el.attr('data-type');
					if (type == me.tagType) {
						me.$cur = $el;
					}
				});
				me.$cur.addClass(me.activeCls);
			}, 50);
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
			cls = me.activeCls,
			route;

		window.scrollTo(0, 0);
		if (!$el.hasClass(cls)) {
			route = [
				'#index',
				encodeURIComponent($el.data('type')),
				encodeURIComponent($el.data('name')),
				encodeURIComponent($el.data('id'))
			].join('/');
			me.navigate(route);
			$el.addClass(cls);
			me.$cur && me.$cur.removeClass(cls);
			me.$cur = $el;
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
			cls = me.activeCls,
			route;

		me.hideSubscribe();
		setTimeout(function () {
			if (!$item.hasClass(cls)) {
				route = [
					'#index',
					encodeURIComponent($el.data('type')),
					encodeURIComponent($el.data('name')),
					encodeURIComponent($el.data('id'))
				].join('/');
				me.navigate(route);
				$item.addClass(cls);
				me.$cur && me.$cur.removeClass(cls);
				me.$cur = $item;
			}
		}, 300);
	},

	onSubscribeManageClick: function () {
		this.navigate('#subscribe');
	}
});

})(Zepto);
