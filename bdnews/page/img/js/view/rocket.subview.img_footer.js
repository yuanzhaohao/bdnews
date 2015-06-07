(function ($) {

rocket.subview.img_footer = rocket.subview.extend({
	el: '#img_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);