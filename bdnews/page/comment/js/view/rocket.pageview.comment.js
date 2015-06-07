(function ($) {

rocket.pageview.comment = rocket.pageview.extend({
	el: '#comment_view',

	init: function (options) {
		var me = this;
		
		me.setup(new rocket.subview.comment_header(
			$.extend({
				page: 'comment'
			}, options),
			me
		));

		me.setup(new rocket.subview.comment_content(
			options,
			me
		));

		me.setup(new rocket.subview.comment_footer(
			$.extend({
				page: 'comment'
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