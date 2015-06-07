(function ($) {

rocket.subview.setting_header = rocket.subview.extend({
	el: '#setting_view_header',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_header(options, me)
		);
		me.show();
	}
});

})(Zepto);