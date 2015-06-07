(function () {

rocket.subview.ui_footer = rocket.subview.extend({
	className: 'ui-footer',

	events: {
		'click .ui-footer-item': 'onItemClick',
		'click .ui-search-btn': 'onSearchClick'
	},

	template: _.template($('#template_ui_footer').text()),

	init: function (options) {
		var me = this,
			isLogin = window.bdnews.login.isLogin();
		
		me.$el.html(
			me.template({
				page: options.page || 'index',
				isLogin: isLogin
			})
		);
		me.show();
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			action = $el.data('action');

		switch (action) {
			case 'login':
				window.bdnews.login.memberLogin();
				break;
			case 'logout':
				window.bdnews.login.memberLogout();
				break;
			case 'subscribe':
				break;
			case 'feedback':
				me.navigate('#feedback');
				break;
			case 'index':
				me.navigate('#index');
				break;
		}
	},

	onSearchClick: function (e) {
		var me = this,
			$input = $(e.currentTarget).siblings('.ui-search-input'),
			speed = 100;

		setTimeout(function () {
			me.navigate('#search/' + encodeURIComponent($input.val()));
			$input.val('');
		}, speed);
	}
});

})(Zepto);