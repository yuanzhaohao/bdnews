(function ($) {

rocket.subview.index_header_nav_subscribe = rocket.subview.extend({

	className: 'nav-subscribe',

	template: _.template($('#template_index_nav_subscribe').text()),

	events: {
		'click .nav-subscribe-item': 'onItemClick'
	},

	init: function (options) {
		var me = this;

		me.$el.html(
			me.template()
		);
		me.show();
	}
});

})(Zepto);