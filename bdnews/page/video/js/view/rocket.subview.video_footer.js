(function ($) {

rocket.subview.video_footer = rocket.subview.extend({
	el: '#video_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);