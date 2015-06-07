(function ($) {

rocket.subview.feedback_footer = rocket.subview.extend({
	el: '#feedback_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);