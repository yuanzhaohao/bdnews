(function () {

rocket.subview.ui_header = rocket.subview.extend({
	className: 'ui-header-container',

	events: {
		'click .ui-header-backbtn': 'onBackClick'
	},

	template: _.template($('#template_ui_header').text()),

	init: function (options) {
		var me = this,
			page = options.page;

		me.page = page;
		me.$el.html(
			me.template(
				$.extend({
					isLogo: page !== 'image' 
						&& page !== 'search' 
						&& page !== 'topic'
						&& page !== 'imgsearch'
				}, options)
			)
		);

		if (page === 'image') {
			me.appendTo(
				new rocket.subview.ui_header_config({
					page: 'image'
				}, me)
				, me.$('.ui-header')
			);
		}
		if (page === 'search' || page === 'imgsearch') {
			me.appendTo(
				new rocket.subview.ui_header_searchbox(
					options
					, me
				)
				, me.$el
			);
			me.$('.ui-header-title ').text(options.title);
		}
		me.show();
	},

	onBackClick: function () {
		var me = this;

		history.back();
		// console.log(rocket.back);
		// if (me.page === 'image' || me.page === 'comment') {
		// 	history.back();
		// 	return;
		// }
		// if (rocket.back 
		// 	&& rocket.back.last) {
		// 	me.navigate(rocket.back.last.hash);
		// }
		// else {
		// 	history.back();
		// }
	}
});

})(Zepto);