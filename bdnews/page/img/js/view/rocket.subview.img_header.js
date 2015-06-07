(function ($) {

rocket.subview.img_header = rocket.subview.extend({
	el: '#img_view_header',

	events: {
		'click .ui-header-listslide': 'onListslideClick',
		'click .ui-header-search': 'onSearchClick'
	},

	init: function (options) {
		var me = this;

		me.show();
	},

	onListslideClick: function () {
		rocket.sideBar.showList(2);
	},

	onSearchClick: function () {
		this.navigate('#imgsearch');
	}
});

})(Zepto);