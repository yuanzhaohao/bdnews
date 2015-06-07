(function ($) {

rocket.subview.img_content = rocket.subview.extend({
	el: '#img_view_content',

	init: function (options) {
		var me = this

		me.appendTo(
			new rocket.subview.img_content_list(
				options, 
				me
			),
			me.$el
		);
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