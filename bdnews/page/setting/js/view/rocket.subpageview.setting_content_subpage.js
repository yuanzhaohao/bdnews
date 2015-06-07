(function ($) {

rocket.subpageview.setting_content_subpage = rocket.subpageview.extend({
	className: 'setting-view-subpage',

	events: {
		'click .ui-refresh': 'onLoadMoreClick'
	},

	template: _.template($('#template_ui_news').text()),

	init: function (options) {
		var me = this;

		me.showLoading(me.$el);

		me.isFirstLoad = true;
		me.featureString = me.getFeatureString();
		me.isLoading = false;
		me.isFirstRender = true;
		me.options = options;
		me.pn = 20;

		me.model = new rocket.model.news({
			pn: me.pn,
			type: options.act,
			name: options.title
		});
	},

	registerEvents: function () {
		var me = this;

		me.model.on('change', me.render, me);
	},

	unregisterEvents: function () {
		var me = this;

		me.model.off('change', me.render, me);
	},

	render: function (model) {
		var me = this,
			newsList = model.getNews();
		
		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.$el.prepend(me.template());
			me.prepend(
				new rocket.subview.ui_news_list({
					type: me.options.act,
					data: newsList
				}, me)
			);
			me.hideLoading(me.$el);
		}
		else {
			me.trigger('loadMoreDataReady', {
				data: newsList
			})
		}

		// me.$('.img-lazyload').each(function (key, el) {
		// 	var $el = $(el),
		// 		url = $el.attr('data-url');
		// 	$el.attr('src', url);
		// 	$el.removeAttr('data-url');
		// 	$el.removeClass('img-lazyload');
		// });

		if (newsList.length < me.pn) {
			me.$('.ui-refresh-wrapper').hide();
			return;
		}
		newsList = null;
	},

	onsubpagebeforechange: function (params) {
		var me = this,
			featureString = me.getFeatureString(me.options);

		if (params.to == me.ec) {
			if (me.featureString == featureString) {
				if (me.isFirstLoad) {
					if (me.isLoading) {
						return;
					}
					me.isLoading = true;
					me.model.fetch({
						success: function () {
							me.isFirstLoad = false;
							me.isLoading = false;
						},
						error: function () {
							me.isLoading = false;
						}
					});
				}
				me.$el.show();
			}
		}
	},

	onLoadMoreClick: function (e) {
		var me = this,
			$el = $(e.currentTarget);

		if (!!me.isLoading) {
			return;
		}
		me.isLoading = true;
		var html = $el.html();

		$el.html('<span class="ui-refresh-pullup-icon"></span>加载中...')
			.addClass('ui-refresh-loading');

		me.model.fetch({
			success: function () {
				me.isLoading = false;
				$el.html(html)
					.removeClass('ui-refresh-loading');
			},
			error: function () {
				me.isLoading = false;
				$el.html(html)
					.removeClass('ui-refresh-loading');
			}
		});
	}
});

})(Zepto);