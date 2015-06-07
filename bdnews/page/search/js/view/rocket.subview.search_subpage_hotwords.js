(function ($) {

rocket.subview.search_subpage_hotwords = rocket.subview.extend({
	className: 'search-hotwords-wrapper',

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

		me.model.fetch({
			success: function (model) {
				me.$el.append(
					me.template({
						words: model.toJSON().hotwords
					})
				);
				me.show();
			}
		});
	},

	onItemClick: function (e) {
		this.navigate('#search/' + $(e.currentTarget).data('keyword'));
	}
});

})(Zepto);