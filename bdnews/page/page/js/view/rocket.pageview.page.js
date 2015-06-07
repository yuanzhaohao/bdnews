(function ($) {

rocket.pageview.page = rocket.pageview.extend({
	el: '#page_view',

	init: function (options) {
		var me = this;
		
		me.setup(new rocket.subview.page_header(
			$.extend({
				page: 'page'
			}, options),
			me
		));

		me.setup(new rocket.subview.page_content(
			options,
			me
		));

		me.setup(new rocket.subview.page_footer(
			$.extend({
				page: 'page'
			}, options),
			me
		));
	},

	registerEvents: function () {
		var me = this,
			ec = me.ec;

		ec.on('pagebeforechange', me.onpagebeforechange, me);
	},

	onpagebeforechange: function (params) {
		var me = this,
			to = params.to;

		if (to == me.ec) {
			me.$el.show();
		}
	}
});

})(Zepto);