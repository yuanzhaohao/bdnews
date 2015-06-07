(function ($) {

rocket.subview.imgsearch_header = rocket.subview.extend({
	el: '#imgsearch_view_header',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_header(options, me)
		);
		me.show();
	}
});

})(Zepto);