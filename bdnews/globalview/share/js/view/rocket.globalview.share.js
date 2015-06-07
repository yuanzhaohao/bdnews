(function () {

rocket.globalview.share = rocket.globalview.extend({
	el: '#share_globalview',

	template: _.template($('#template_share_list').text()),

	events: {
		'click .share-overlay': 'hideShare',
		'click .share-cancel': 'hideShare'
	},

	init: function (options) {
		var me = this;

		me.overlayEl = me.$('.share-overlay')[0];
		me.catalogEL = me.$('.share-catalog')[0];
		me.isShowShare = false;
		me.$('.share-list').html(
			me.template({
				list: window.bdnews.conf.getShareIcons()
			})
		);
		me.h = 268;

		me.$el[0].addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);
	},

	showShare: function () {
		var me = this,
			speed = 300;

		if (!me.isShowShare) {
			me.$el.show();
			me.catalogEL.style.webkitTransitionDuration = '0ms';
			me.catalogEL.style.webkitTransform = 'translate3d(0px, ' + me.h + 'px, 0px)';
			me.catalogEL.style.display = 'block';
			me.overlayEl.style.display = 'block';
			
			setTimeout(function () {
				me.catalogEL.style.webkitTransitionDuration = speed + 'ms';
				me.catalogEL.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
				me.isShowShare = true;
			}, 0);
		}
	},

	hideShare: function () {
		var me = this,
			speed = 300;

		if (me.isShowShare) {
			me.catalogEL.style.webkitTransitionDuration = '0ms';
			me.catalogEL.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			
			setTimeout(function () {
				me.catalogEL.style.webkitTransitionDuration = speed + 'ms';
				me.catalogEL.style.webkitTransform = 'translate3d(0px, ' + me.h + 'px, 0px)';
			}, 0);

			setTimeout(function () {
				me.$el.hide();
				me.catalogEL.style.display = 'none';
				me.overlayEl.style.display = 'none';
				me.isShowShare = false;
			}, speed);
		}
	}
});

})(Zepto);