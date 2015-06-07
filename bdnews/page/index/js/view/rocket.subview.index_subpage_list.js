(function ($) {

rocket.subview.index_subpage_list = rocket.subview.extend({
	className: 'ui-news-list',

	events: {
		'click .ui-news-item': 'onItemClick'
	},

	template: _.template($('#template_ui_news_list').text()),

	init: function (options) {
		var me = this;

		me.data = options.data || [];
		me.type = options.type;
		me.isFirstRender = true;
		me.render();
	},

	render: function () {
		var me = this;

		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.$el.html(
				me.template({
					list: me.data,
					type: me.type
				})
			);
			me.show();
		}
		else {
			me.$el.append(
				me.template({
					list: me.data,
					type: me.type
				})
			);
		}
		setTimeout(function () {
			me.$('.img-lazyload').scrollLazyload({
				threshold: 0,
				isThrottle: false,
				isFade: true
			});
		}, 100);
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
		var me = this,
			$el = $(e.currentTarget),
			route = [
				'#page',
				$el.data('type'),
				$el.data('nid')
			].join('/');

		me.navigate(route);
	}
});

})(Zepto);