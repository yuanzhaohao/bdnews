(function ($) {

rocket.subpageview.video_content_subpage = rocket.subpageview.extend({
	className: 'video-view-subpage',

	events: {
		'click .ui-refresh': 'onLoadMoreClick'
	},

	template: _.template($('#template_ui_news').text()),

	init: function (options) {
		var me = this;

		me.type = options.type;
		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;
		me.isFirstRender = true;
		me.isLoading = false;
		switch (me.type) {
			case 'amuse':
			case 'game':
			case 'squaredance':
			case 'education':
			case 'yuanchuang':
			case 'music':
			case 'sport':
			case 'yule':
			case 'info':
				me.isSpeacil = true;
				me.pn = 1;
				break;
			default:
				me.isSpeacil = false;
				me.pn = 12;
				break;
		}
		me.start = 0;
		me.end = me.start + me.pn;

		me.showLoading(me.$el);
		me.model = new rocket.model.video({
			type: me.type,
			start: me.start,
			end: me.end
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
		var me = this;
		
		if (!me.type) {
			me.prepend(
				new rocket.subview.video_subpage_index(
					$.extend({
						data: model.getIndexVideo()
					}, me.options)
					, me
				)
			);
			
			me.prepend(
				new rocket.subview.video_subpage_carousel(
					$.extend({
						data: model.getCarousel()
					}, me.options)
					, me
				)
			);
			me.hideLoading(me.$el);
		}
		else {
			var videos = model.getVideo();

			if (me.isFirstRender) {
				me.isFirstRender = false;

				if (me.type !== 'live') {
					me.$el.html(me.template());	
				}
				me.prepend(
					new rocket.subview.video_subpage_list(
						$.extend({
							data: videos
						}, me.options)
						, me
					)
				);
				me.hideLoading(me.$el);
			}
			else {
				me.trigger('loadMoreDataReady', {
					data: videos
				});
			}
			if (!model.isHasMore && !me.isSpeacil) {
				me.$('.ui-refresh-wrapper').hide();
				return;
			}
		}
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

		me.start = me.end;
		me.end = me.end + me.pn;
		me.model.start = me.start;
		me.model.end = me.end;
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