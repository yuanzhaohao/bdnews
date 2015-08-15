(function () {

rocket.subview.image_slide = rocket.subview.extend({
	className: 'image-slide',

	events: {
		'click .image-slide-item': 'onItemClick'
	},

	template: _.template($('#template_image_slide').text()),

	init: function (options) {
		var me = this;

		me.type = options.type;
		me.nid = options.nid;
		me.pid = Number(options.pid);
		me.data = options.data;
		me.origin = options.origin;

		me.$el.html(
			me.template({
				id: me.pid || 0,
				len: me.data.length || 0,
				list: me.data
			})
		);

		me.prepend(
			new rocket.subview.ui_header({
				page: 'image',
				id: me.pid || 0,
				len: me.data.length || 0
			}, me)
		);
		me.render();
	},

	registerEvents: function () {
		var me = this,
			subec = me.subec;

		subec.on('goOrigin', me.onGoOrigin, me);
	},

	unregisterEvents: function () {
		var me = this,
			subec = me.subec;

		subec.off('goOrigin', me.onGoOrigin, me);
	},

	render: function () {
		var me = this,
			$items = me.$('.image-slide-item'),
			scroll;

		me.show();
		scroll = new YScroll(me.$('.image-slide-list')[0], {
		  distance: window.innerWidth
		});
		scroll.scroller.addEventListener('sPointmove', function (e) {
			var cur = e.curPoint;
			me.pid = cur;
			me.$('.image-icon-slide').html((cur + 1) + ' / ' + me.data.length);
			$items.eq(cur).html('<img src="' + me.data[cur].url+ '">');
			Backbone.history.navigate([
					'#image',
					me.type,
					me.nid,
					cur
				].join('/'), {
					trigger: false,
					replace: true
				}
			);
		}, false);
		scroll.moveToPoint(me.pid, 0);
		$items.eq(me.pid).html('<img src="' + me.data[me.pid].url+ '">');
		me.subec.trigger('getSlideObj', scroll);
	},

	onItemClick: function () {
		var me = this,
			$header = me.$('.image-slide-header'),
			h = $header.height();

		if (!me.isHideHeader) {
			$header.animate({
				top: -h
			}, 250);
			me.isHideHeader = true;
		}
		else {
			$header.animate({
				top: 0
			}, 250);
			me.isHideHeader = false;
		}
	},

	onGoOrigin: function () {
		var me = this;

		location.href = me.origin[me.pid].url;
	}
});

})(Zepto);
