(function ($) {

rocket.subview.imgsearch_subpage_query = rocket.subview.extend({
	className: 'imgsearch-query',

	events: {
		'click .imgsearch-query-item': 'onItemClick'
	},

	template: _.template($('#template_imgsearch_query').text()),

	init: function (options) {
		var me = this;

		me.data = options.data || [];
		me.isFirstRender = true;
		me.render();
	},

	render: function () {
		var me = this;

		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.$el.html(
				me.template({
					list: me.data
				})
			);
			me.show();
		}
		me.data = null;
	},

	onItemClick: function (e) {
		this.navigate('#imgsearch/' + $(e.currentTarget).data('word'));
	}
});

})(Zepto);