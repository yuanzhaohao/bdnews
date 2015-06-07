(function ($) {

rocket.subview.subscribe_footer = rocket.subview.extend({
	el: '#subscribe_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);
