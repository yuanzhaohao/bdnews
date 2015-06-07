(function ($) {

rocket.subview.setting_footer = rocket.subview.extend({
	el: '#setting_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);