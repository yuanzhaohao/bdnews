(function ($) {

rocket.subview.comment_footer = rocket.subview.extend({
	el: '#comment_view_footer',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_footer(options, me)
		);
		me.show();
	}
});

})(Zepto);