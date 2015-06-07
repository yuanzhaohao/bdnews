(function ($) {

rocket.subview.subscribe_header = rocket.subview.extend({
	el: '#subscribe_view_header',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_header(options, me)
		);
		me.show();
	}
});

})(Zepto);
