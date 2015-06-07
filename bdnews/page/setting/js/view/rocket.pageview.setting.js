(function ($) {

rocket.pageview.setting = rocket.pageview.extend({
	el: '#setting_view',

	init: function (options) {
		var me = this;
		
		me.title = options.title;

		me.setup(new rocket.subview.setting_header(
			$.extend({
				page: 'setting'
			}, options),
			me
		));

		me.setup(new rocket.subview.setting_content(
			options,
			me
		));

		me.setup(new rocket.subview.setting_footer(
			$.extend({
				page: 'setting'
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