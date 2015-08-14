(function ($) {

rocket.subpageview.image_subpage = rocket.subpageview.extend({
	className: 'image-view-subpage',

	events: {
		'click .image-nums-slide': 'goThumb',
		'click .image-nums-thumb': 'goSlide'
	},

	init: function (options) {
		var me = this;

		me.isFirstLoad = true;
		me.isFirstThumb = true;
		me.hideLoading(me.$el);
	},

	registerEvents: function () {
		var me = this,
			subec = me.subec;

		subec.on('thumbItemClick', me.onThumbItemClick, me);
		subec.on('getSlideObj', me.onGetSlideObj, me);
	},

	unregisterEvents: function () {
		var me = this,
			subec = me.subec;

		subec.off('thumbItemClick', me.onThumbItemClick, me);
		subec.off('getSlideObj', me.onGetSlideObj, me);
	},

	onsubpagebeforechange: function (params) {
		var me = this,
			to = params.to,
			param = params.params,
			featureString = me.getFeatureString(param);

		if (to == me.ec) {
			if (me.featureString == featureString) {
				if (me.isFirstLoad) {
					var article = rocket.model.article.getInstance(param.nid);

					if (!article) {
						article = new rocket.model.article(param);
						article.fetch({
							success: function (model) {
								me.model = model;
								me.render();
							}
						})
					}
					else {
						me.model = article;
						me.render();
					}
					me.isFirstLoad = false;
				}
				me.$el.show();
			}
		}
	},

	render: function (model) {
		var me = this,
			images = me.model.getImages();

		me.data = images.data;
		me.isThumb = !!images.data[0].width;
		if (me.isThumb) {
			me.prepend(
				new rocket.subview.image_thumb(
					$.extend({
						data: me.data
					}, me.options)
					, me
				)
			);
		}
		me.prepend(
			new rocket.subview.image_slide(
				$.extend({
					data: me.data,
					origin: images.origin
				}, me.options)
				, me
			)
		);
	},

	goThumb: function () {
		var me = this;

		if (!me.isThumb) {
			return;
		}

		me.$('.image-slide').hide();
		me.$('.image-thumb').show();
		if (me.isFirstThumb) {
			me.isFirstThumb = false;
			me.$('.thumb-lazyload')
				.scrollLazyload({
					threshold: 100,
					container: me.$('.image-thumb')[0],
					isFade: true
				});
		}
	},

	goSlide: function () {
		var me = this;

		me.$('.image-slide').show();
		me.$('.image-thumb').hide();
	},

	onThumbItemClick: function (i) {
		var me = this,
			speed = 0;

		me.slideObj.moveToPoint(i, speed);
		setTimeout(function () {
			me.goSlide();
		}, speed + 50);
	},

	onGetSlideObj: function (s) {
		var me = this;

		me.slideObj = s;
	}
});

})(Zepto);
