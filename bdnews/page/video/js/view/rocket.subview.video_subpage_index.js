(function ($) {

rocket.subview.video_subpage_index = rocket.subview.extend({
	className: 'video-subpage-index',

	events: {
		'click .video-more': 'onMoreClick'
	},

	template: _.template($('#template_video_subpage_index').text()),

	init: function (options) {
		var me = this;

		console.log(options.data);
		me.$el.html(
			me.template({
				list: options.data
			})
		);
		me.show();
		setTimeout(function () {
			me.$('.img-lazyload').scrollLazyload({
				threshold: 0,
				isThrottle: false,
				isFade: false
			});
		}, 200);
	},

	onMoreClick: function (e) {
		this.navigate($(e.currentTarget).data('url'));
	}
});

})(Zepto);