(function ($) {

rocket.subview.search_subpage_list = rocket.subview.extend({
	className: 'ui-news-list',

	events: {
		'click .ui-news-item': 'onItemClick'
	},

	template: _.template($('#template_search_list').text()),

	init: function (options) {
		var me = this;

		me.data = options.data || [];
		me.isFirstRender = true;
		me.render();
	},

	render: function () {
		var me = this;

		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.$el.html(
				me.template({
					list: me.data
				})
			);
			me.show();
		}
		else {
			me.$el.append(
				me.template({
					list: me.data
				})
			);
		}
		setTimeout(function () {
			me.$('.img-lazyload').scrollLazyload({
				threshold: 50,
				isThrottle: false,
				isFade: true
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
		var me = this,
			$el = $(e.currentTarget),
			route = [
				'#page',
				$el.data('type'),
				encodeURIComponent($el.data('nid'))
			].join('/');

		me.navigate(route);
	}
});

})(Zepto);