(function ($) {

rocket.pageview.topic = rocket.pageview.extend({
	el: '#topic_view',

	init: function (options) {
		var me = this;
		
		me.setup(new rocket.subview.topic_header(
			$.extend({
				page: 'topic'
			}, options),
			me
		));

		me.setup(new rocket.subview.topic_content(
			options,
			me
		));

		me.setup(new rocket.subview.topic_footer(
			$.extend({
				page: 'topic'
			}, options),
			me
		));
	},

	registerEvents: function () {
		var me = this,
			ec = me.ec;

		ec.on('pagebeforechange', me.onpagebeforechange, me);
		ec.on('changeTitle', me.onChangeTitle, me);
	},

	unregisterEvents: function () {
		this.ec.off('changeTitle', me.onChangeTitle, me);
	},

	onpagebeforechange: function (params) {
		var me = this,
			to = params.to;

		if (to == me.ec) {
			me.$el.show();
		}
	},

	onChangeTitle: function (t) {
		var me = this;

		me.$('.ui-header-title ').text(t);
	}
});

})(Zepto);