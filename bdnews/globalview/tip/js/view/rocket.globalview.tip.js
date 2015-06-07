(function () {

rocket.globalview.tip = rocket.globalview.extend({
	el: '#tip_globalview',

	init: function (options) {
		var me = this;

		// me.$('.tip-box').html('');
		me.boxEl = me.$('.tip-box')[0];
	},

	showTip: function (txt) {
		var me = this,
			speed = 300;

		me.$el.show();
		me.boxEl.style.webkitTransitionDuration = '0ms';
		me.boxEl.style.webkitTransform = 'scale(0, 0)';
		me.boxEl.innerText = txt;

		setTimeout(function () {
			me.boxEl.style.webkitTransitionDuration = speed + 'ms';
			me.boxEl.style.webkitTransform = 'scale(1, 1)';
		}, 0);

		setTimeout(function () {
			me.boxEl.style.webkitTransitionDuration = speed + 'ms';
			me.boxEl.style.webkitTransform = 'scale(0, 0)';
		}, speed * 3);

		setTimeout(function () {
			me.$el.hide();
		}, speed * 4 + 20);
	}
});

})(Zepto);