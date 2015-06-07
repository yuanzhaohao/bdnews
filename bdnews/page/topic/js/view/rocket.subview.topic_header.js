(function ($) {

rocket.subview.topic_header = rocket.subview.extend({
	el: '#topic_view_header',

	init: function (options) {
		var me = this;

		me.prepend(
			new rocket.subview.ui_header(options, me)
		);
		me.show();
	}
});

})(Zepto);