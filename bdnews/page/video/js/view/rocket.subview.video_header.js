(function ($) {

rocket.subview.video_header = rocket.subview.extend({
	el: '#video_view_header',

	events: {
		'click .ui-header-listslide': 'onListslideClick',
		'click .ui-header-search': 'onSearchClick'
	},

	init: function (options) {
		var me = this;

		me.appendTo(
			new rocket.subview.video_header_nav(options, me), 
			me.$('.ui-header-container')
		);
		me.show();
	},

	onListslideClick: function () {
		rocket.sideBar.showList(1);
	},

	onSearchClick: function () {
		this.navigate('#search');
	}
});

})(Zepto);