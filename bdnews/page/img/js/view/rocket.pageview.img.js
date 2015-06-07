(function ($) {

rocket.pageview.img = rocket.pageview.extend({
	el: '#img_view',

	init: function (options) {
		var me = this;
		
		me.setup(new rocket.subview.img_header(
			$.extend({
				page: 'img'
			}, options),
			me
		));

		me.setup(new rocket.subview.img_content(
			options,
			me
		));

		me.setup(new rocket.subview.img_footer(
			$.extend({
				page: 'img'
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