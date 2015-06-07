(function ($) {

rocket.subview.video_subpage_list = rocket.subview.extend({
	events: {
		// 'click .ui-news-item': 'onItemClick'
	},

	template: _.template($('#template_video_channel_list').text()),

	needsTemplate: _.template($('#template_video_channel_needs').text()),

	init: function (options) {
		var me = this;

		me.data = options.data || [];
		me.type = options.type;
		me.isFirstRender = true;
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
			case 'live':
				me.isSpeacil = true;
				me.pn = 1;
				break;
			default:
				me.isSpeacil = false;
				me.pn = 12;
				break;
		}
		me.render();
	},

	render: function () {
		var me = this;

		if (me.isFirstRender) {
			me.isFirstRender = false;
			var type = me.type;
			if (me.isSpeacil) {
				me.$el.html(
					me.needsTemplate({
						list: me.data,
						type: me.type
					})
				);
			}
			else {
				me.$el.html(
					me.template({
						list: me.data,
						type: me.type
					})
				);
			}
			me.show();
		}
		else {
			if (me.isSpeacil) {
				me.$el.append(
					me.needsTemplate({
						list: me.data,
						type: me.type
					})
				);
			}
			else {
				me.$el.append(
					me.template({
						list: me.data,
						type: me.type
					})
				);
			}
		}
		setTimeout(function () {
			me.$('.img-lazyload').scrollLazyload({
				threshold: 50,
				isThrottle: false,
				isFade: false
			});
		}, 200);
		me.data = null;
	},

	registerEvents: function () {
		var me = this,
			subec = me.subec;

		subec.on('loadMoreDataReady', me.onLoadMoreDataReady, me);
	},

	unregisterEvents: function () {
		var me = this,
			subec = me.subec;

		subec.off('loadMoreDataReady', me.onLoadMoreDataReady, me);
	},

	onLoadMoreDataReady: function (params) {
		var me = this;

		me.data = params.data || [];
		me.render();
	},

	onItemClick: function (e) {
		
	}
});

})(Zepto);