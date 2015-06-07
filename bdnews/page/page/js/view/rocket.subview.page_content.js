(function ($) {

rocket.subview.page_content = rocket.subview.extend({
	el: '#page_view_content',

	init: function (options) {
		var me = this,
			subView,
			spm;

		spm = me.getSubpageManager({
			subpageClass: rocket.subpageview.page_content_subpage,
			maxSubpages: 1,
			subpageTransition: 'simple'
		});

		subView = new rocket.subpageview.page_content_subpage(options, me);

		me.append(subView);
		spm.registerSubpage(me.featureString, subView);
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
	}
});

})(Zepto);