(function ($) {

rocket.subview.index_subpage_carousel = rocket.subview.extend({
	className: 'index-carousel',

	events: {
		'click .index-carousel-item': 'onItemClick'
	},

	template: _.template($('#template_index_carousel').text()),

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
			curIndex = 0;

		$title.text(
			$items
				.eq(curIndex)
				.data('title')
		);
		$navs.eq(curIndex).addClass('cur');
		var scroll = new YScroll($inner[0], {
		  distance: window.innerWidth
		});
		scroll.scroller.addEventListener('sPointmove', function (e) {
			var cur = e.curPoint;
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
		}, false);
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			route = [
				'#page',
				$el.data('type'),
				$el.data('nid')
			].join('/');

		me.navigate(route);
	}

});

})(Zepto);
