(function ($) {

rocket.subview.search_footer = rocket.subview.extend({
	el: '#search_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);