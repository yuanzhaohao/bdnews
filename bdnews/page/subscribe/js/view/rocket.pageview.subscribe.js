(function ($) {

rocket.pageview.subscribe = rocket.pageview.extend({
	el: '#subscribe_view',

	init: function (options) {
		var me = this;
		
		me.setup(new rocket.subview.subscribe_header(
			$.extend({
				page: 'subscribe'
			}, options),
			me
		));

		me.setup(new rocket.subview.subscribe_list(
			options,
			me
		));

        me.setup(new rocket.subview.subscribe_tags(
			options,
			me
		));

		me.setup(new rocket.subview.subscribe_content(
			options,
			me
		));

		me.setup(new rocket.subview.subscribe_footer(
			$.extend({
				page: 'subscribe'
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
