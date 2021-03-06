(function ($) {

rocket.subview.video_subpage_carousel = rocket.subview.extend({
	className: 'index-carousel',

	events: {
		'click .index-carousel-item': 'onItemClick'
	},
	
	template: _.template($('#template_video_carousel').text()),

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
			me.initCarousel();
		}
	},

	initCarousel: function () {
		var me = this,
			$inner = me.$('.index-carousel-inner'),
			$title = me.$('.index-carousel-title'),
			$items = me.$('.index-carousel-item'),
			$navs = me.$('.index-carousel-nav').find('i'),
			curIndex = 0,
			data = [];

		me.data.forEach(function (v, k) {
			data.push({
				url: v.img_url
			});
		});

		$title.text(
			$items
				.eq(curIndex)
				.data('title')
		);
		$navs.eq(curIndex).addClass('cur');

		setTimeout(function () {
			$inner.imageSwipe({
				startIndex: curIndex,
				itemclassName: 'index-carousel-item',
				itemSelector: '.index-carousel-item',
				// data: new Array(me.data.length),
				// isLoadImg: false,
				data: data,
				isLoadBeside: true,
				isHandleWindow: false,
				onAfterChange: function (cur) {
					$title.text(
						$items
							.eq(cur)
							.data('title')
					);
					$navs
						.eq(cur)
						.addClass('cur')
						.siblings('i')
						.removeClass('cur');
				}
			});
		}, 150);
	},

	onItemClick: function (e) {
		
	}

});

})(Zepto);