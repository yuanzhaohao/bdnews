(function ($) {

rocket.pageview.imgsearch = rocket.pageview.extend({
	el: '#imgsearch_view',

	init: function (options) {
		var me = this,
			keyword = options.keyword;

		me.setup(new rocket.subview.imgsearch_header(
			$.extend({
				page: 'imgsearch',
				title: '图片搜索'
			}, options),
			me
		));

		me.setup(new rocket.subview.imgsearch_content(
			options,
			me
		));

		me.setup(new rocket.subview.imgsearch_footer(
			$.extend({
				page: 'imgsearch'
			}, options),
			me
		));
	},

	registerEvents: function () {
		var me = this,
			ec = me.ec;

		ec.on('pagebeforechange', me.onpagebeforechange, me);
		ec.on('changeInputKeyword', me.onChangeInputKeyword, me);
	},

	unregisterEvents: function () {
		var me = this,
			ec = me.ec;

		ec.off('changeInputKeyword', me.onChangeInputKeyword, me);
	},

	onpagebeforechange: function (params) {
		var me = this,
			to = params.to;

		if (to == me.ec) {
			me.$el.show();
		}
	},

	onChangeInputKeyword: function (keyword) {
		this.$('.ui-search-input').val(decodeURIComponent(keyword));
	}
});

})(Zepto);