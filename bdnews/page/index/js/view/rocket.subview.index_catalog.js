(function () {

rocket.subview.index_catalog = rocket.subview.extend({
	el: '#index_view_catalog',

	events: {
		'click .index-catalog-item': 'onItemClick',
		'click .index-catalog-header': 'onHeaderClick',
		'click .index-catalog-search': 'onSearchClick'
	},

	template: _.template($('#template_index_catalog').text()),

	init: function (options) {
		var me = this;

		me.$el.height(window.innerHeight);
		me.model = rocket.pageview.index.tagModel;
		me.isLogin = window.bdnews.login.isLogin();
		me.isFirstRender = true;
		if (!me.isLogin) {
			me.render();
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

	render: function (model) {
		var me = this;

		if (me.isFirstRender) {
			var tags = me.isLogin
				? me.model.toJSON().data.tag
				: me.model;
			
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
				me.initTouchCatalog();
			}, 150);
		}
	},

	initTouchCatalog: function () {
		var me = this,
			$list = me.$('.index-catalog-list');

		$list[0].addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);
		
		$list.touchScroll({
			isCrosswise: false,
			minDist: me.$el.height() 
				- me.$('.index-catalog-header').height() 
				- me.$('.index-catalog-footer').height() 
				- $list.height()
		});
	},

	onHeaderClick: function (e) {
		switch ($(e.currentTarget).data('act')) {
			case 'login':
				window.bdnews.login.memberLogin();
				break;

			case 'logout':
				window.bdnews.login.memberLogout();
				break;
		}
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			route,
			ec = me.ec,
			speed = 400,
			act = $el.data('act');

		ec.trigger('itemClick', speed);
		$el.addClass('index-catalog-item-pressed');
		setTimeout(function () {
			$el.removeClass('index-catalog-item-pressed');

			setTimeout( function () {
				switch (act) {
					case 'push':
					case 'collect':
					case 'feedback':
						route = (act !== 'feedback')
							? [
								'#setting',
								encodeURIComponent(act),
								encodeURIComponent($el.data('title'))
							].join('/')
							: '#feedback';

						me.navigate(route);
						break;

					default:
						route = [
							'#index',
							encodeURIComponent($el.data('type')),
							encodeURIComponent($el.data('name')),
							encodeURIComponent($el.data('id'))
						].join('/');

						me.navigate(route);
						ec.trigger('navIndex', $el.data('index') || 0);
						break;
				}
				window.scrollTo(0, 0);
			}, speed);
		}, speed + 50);
	},

	onSearchClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			speed = 200;

		me.ec.trigger('itemClick', speed);
		setTimeout(function () {
			me.navigate('#search', {
				trigger: false,
				replace: true
			});
		}, speed + speed);
	}

});

})(Zepto);