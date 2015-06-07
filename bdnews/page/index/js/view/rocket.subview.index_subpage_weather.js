(function ($) {

rocket.subview.index_subpage_weather = rocket.subview.extend({
	className: 'index-weather',

	template: _.template($('#template_index_weather').text()),

	init: function (options) {
		var me = this;

		me.isFirstRender = true;
		me.model = new rocket.model.weather({
			city: options.city
		});
		me.city = options.city;
		me.model.fetch();
	},

	render: function (model) {
		var me = this,
			data = model.toJSON();

		if (!data.errno) {
			me.$el.html(
				me.template({
					data: $.extend({
						city: me.city
					}, data.data)
				})
			);
			me.show();
		}
	},

	registerEvents: function () {
		var me = this;

		me.model.on('change', me.render, me);
	},

	unregisterEvents: function () {
		var me = this;

		me.model.off('change', me.render, me);
	}
});

})(Zepto);