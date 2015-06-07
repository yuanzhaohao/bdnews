(function () {

rocket.subview.image_thumb = rocket.subview.extend({
	className: 'image-thumb',

	events: {
		'click .image-thumb-item': 'onItemClick'
	},

	template: _.template($('#template_image_thumb').text()),

	init: function (options) {
		var me = this;

		me.$el.html(
			me.template({
				len: options.data.length || 0
			})
		);
		setTimeout(function () {
			me.$('.image-thumb-list').imageThumb({
				data: options.data
			});
		}, 200);
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget);

		me.subec.trigger('thumbItemClick', Number($el.data('index')));
	}
});

})(Zepto);