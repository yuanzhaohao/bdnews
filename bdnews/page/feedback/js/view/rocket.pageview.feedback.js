(function ($) {

rocket.pageview.feedback = rocket.pageview.extend({
	el: '#feedback_view',

	events: {
		'click .ui-header-backbtn': 'onBackClick'
	},

	init: function (options) {
		var me = this;

		me.hideLoading(me.$el);
		me.$('#feedback_form').on('submit', function (e) {
			var postdata = me.$('.feedback-textarea'),
				postmail = me.$('.feedback-text'),
				regNum,
				regMail;

			if (postdata.val() === '') {
				postdata.focus();
				return false;
			}
			if (postmail.val() !== '') {
				regNum = /^[0-9-]+(\.)?([0-9]+)$/;
				regMail = /^[a-zA-Z_]+[a-zA-Z0-9-]*@([a-zA-Z0-9]+\.)+(com|cn|org|net)$/;
				if (!regNum.test(postmail.val())
					&& !regMail.test(postmail.val())) {
					postmail.focus();
					return false;
				}
			}
		});

		me.setup(new rocket.subview.feedback_footer(
			$.extend({
				page: 'feedback'
			}, options),
			me
		));
	},

	registerEvents: function () {
		var me = this,
			ec = me.ec;

		ec.on('pagebeforechange', me.onpagebeforechange, me);
	},

	onpagebeforechange: function (params) {
		var me = this,
			to = params.to;

		if (to == me.ec) {
			me.$el.show();
		}
	},

	onBackClick: function () {
		var me = this;

		history.back();
	}
});

})(Zepto);