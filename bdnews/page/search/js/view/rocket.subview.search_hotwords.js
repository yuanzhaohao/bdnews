(function ($) {

rocket.subview.search_hotwords = rocket.subview.extend({
	el: '#search_view_hotwords',

	events: {
		'click .search-hotwords-item': 'onItemClick'
	},

	template: _.template($('#template_search_hotwords').text()),

	init: function (options) {
		var me = this ;

		me.isFirstLoad = true;
		me.model = new rocket.model.search_hotwords({
			type: 'news'
		});

		me.model.fetch();
		me.showLoading(me.$el);
	},

	render: function (model) {
		var me = this,
			data = model.toJSON();

		me.$el.append(
			me.template({
				words: data.hotwords
			})
		);
		me.hideLoading(me.$el);
	},

	registerEvents: function () {
		var me = this;

		me.ec.on('pagebeforechange', me.onpagebeforechange, me);
		me.model.on('change', me.render, me);
	},

	unregisterEvents: function () {
		var me = this;

		me.model.off('change', me.render, me);
	},

	onpagebeforechange: function (params) {
		var me = this,
			to = params.to;

		if (to == me.ec) {
			me.$el.show();
		}
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget);

		me.navigate('#search/' + $el.data('keyword'), {
			trigger: false,
			replace: true
		});
	}
});

})(Zepto);