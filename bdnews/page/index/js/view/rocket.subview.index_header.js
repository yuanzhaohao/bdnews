(function ($) {

rocket.subview.index_header = rocket.subview.extend({
	el: '#index_view_header',

	events: {
		'click .ui-header-listslide': 'onListslideClick',
		'click .ui-header-search': 'onSearchClick'
	},

	init: function (options) {
		var me = this;

		me.appendTo(
			new rocket.subview.index_header_nav(options, me), 
			me.$('.ui-header-container')
		);
		me.show();
	},

	onListslideClick: function () {
		rocket.sideBar.showList(0);
	},

	onSearchClick: function () {
		this.navigate('#search');
	}
});

})(Zepto);