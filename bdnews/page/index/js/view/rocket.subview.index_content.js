(function ($) {

rocket.subview.index_content = rocket.subview.extend({
	el: '#index_view_content',

	init: function (options) {
		var me = this,
			subView,
			spm;

		spm = me.getSubpageManager({
			subpageClass: rocket.subpageview.index_content_subpage,
			maxSubpages: 2,
			subpageTransition: 'simple'
		});

		subView = new rocket.subpageview.index_content_subpage(options, me);

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