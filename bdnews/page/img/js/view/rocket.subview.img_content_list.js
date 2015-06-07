(function ($) {

rocket.subview.img_content_list = rocket.subview.extend({
	className: 'img-list',

	events: {
		'click .img-item': 'onItemClick'
	},

	template: _.template($('#template_img_content').text()),

	init: function (options) {
		var me = this;
		
		me.show();
		me.showLoading(me.$el);
		me.$el.html(
			me.template({
				list: window.bdnews.conf.getImgTag()
			})
		);
		setTimeout(function () {
			me.$('.img-lazyload').scrollLazyload({
				threshold: 0,
				isThrottle: false,
				isFade: true
			});
		}, 100);
		me.hideLoading(me.$el);
	},

	onItemClick: function (e) {
		this.navigate('#imgsearch/' + $(e.currentTarget).data('word'));
	}
});

})(Zepto);