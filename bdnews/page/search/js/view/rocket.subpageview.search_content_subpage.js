(function ($) {

rocket.subpageview.search_content_subpage = rocket.subpageview.extend({
	className: 'search-view-subpage',

	events: {
		'click .ui-refresh': 'onLoadMoreClick'
	},

	template: _.template($('#template_ui_news').text()),

	init: function (options) {
		var me = this;

		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;
		me.isFirstRender = true;
		me.isLoading = false;
		me.options = options;
		me.isSearch = !!options.keyword;
		me.pn = 20;
		if (me.isSearch) {
			me.model = new rocket.model.news({
				type: 'search',
				name: options.keyword,
				pn: me.pn
			});
		}
		else {
			me.initKeyword();
		}

		me.showLoading(me.$el);
	},

	registerEvents: function () {
		var me = this;

		if (me.isSearch) {
			me.model.on('change', me.render, me);
		}
	},

	unregisterEvents: function () {
		var me = this;

		if (me.isSearch) {
			me.model.off('change', me.render, me);
		}
	},

	render: function (model) {
		var me = this,
			newsList = model.getNews();
		
		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.$el.prepend(me.template());
			me.prepend(
				new rocket.subview.ui_news_list({
					type: 'search',
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
					if (me.isSearch) {
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
					me.ec.trigger('changeInputKeyword', me.options.keyword);
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
	},

	initKeyword: function () {
		var me = this;

		me.prepend(
			new rocket.subview.search_subpage_hotwords({}, me)
		);
		me.hideLoading(me.$el);
	}
});

})(Zepto);