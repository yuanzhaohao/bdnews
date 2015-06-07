(function ($) {

rocket.subview.imgsearch_subpage_list = rocket.subview.extend({
	className: 'imgsearch-list clearfix',

	events: {
		'click .imgsearch-item': 'onItemClick'
	},

	template: _.template($('#template_imgsearch_list').text()),

	init: function (options) {
		var me = this;

		me.data = options.data || [];
		me.word = options.word;
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
		var me = this;

		me.navigate('#imgimage/' + me.word + '/' + $(e.currentTarget).data('index'));
	}
});

})(Zepto);