(function ($) {

rocket.subpageview.imgsearch_content_subpage = rocket.subpageview.extend({
	className: 'imgsearch-view-subpage',

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
		me.isSearch = !!options.keyword;
		me.pn = 0;
		me.rn = 20;
		me.word = options.keyword;
		me.data = [];

		if (me.isSearch) {
			me.model = new rocket.model.imgsearch({
				word: options.keyword,
				pn: me.pn,
				rn: me.rn
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
			imgs = model.getImgs(),
			data = me.data;
		
		if (me.isFirstRender) {
			var query = model.getQuery();

			me.isFirstRender = false;
			if (query.length > 0) {
				me.prepend(
					new rocket.subview.imgsearch_subpage_query({
						data: query
					}, me)
				);
			}

			me.$el.prepend(me.template());
			me.prepend(
				new rocket.subview.imgsearch_subpage_list({
					data: imgs,
					word: me.word
				}, me)
			);
			me.hideLoading(me.$el);
		}
		else {
			me.trigger('loadMoreDataReady', {
				data: imgs,
				word: me.word
			})
		}
		imgs.forEach(function (v, k) {
			data.push({
				width: v.width,
				height: v.height,
				size: v.size,
				title: v.frompagetitle,
				origin: v.fromurl,
				url: v.picurl,
				thumb: v.thumburl,
				index: v.index
			});
		});
	},

	onsubpagebeforechange: function (params) {
		var me = this,
			from = params.from,
			to = params.to,
			param = params.params,
			featureString = me.getFeatureString(param);

		if (to == me.ec) {
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

		me.pn = me.pn + me.rn;
		me.model.pn = me.pn;
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

		me.$el.html();
		me.hideLoading(me.$el);
	}
});

})(Zepto);