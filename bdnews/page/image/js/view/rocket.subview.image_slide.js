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
			s;

		setTimeout(function () {
			s = me.$('.image-slide-list').imageSwipe({
				startIndex: me.pid,
				itemclassName: 'image-slide-item',
				itemSelector: '.image-slide-item',
				data: me.data,
				autoTime: 0,
				onAfterChange: function (cur) {
					me.pid = cur;
					me.$('.image-icon-slide').html((cur + 1) + ' / ' + me.data.length);
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
				}
			});
			me.subec.trigger('getSlideObj', s);
		}, 150);
		me.show();
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