(function () {

rocket.globalview.dialog = rocket.globalview.extend({
	el: '#dialog_globalview',
	
	events: {
		'click .dialog-overlay': 'hideDialog',
		'click .dialog-catalog-confirm': 'onConfirmClick',
		'click .dialog-catalog-cancel': 'onCancelClick'
	},

	template: _.template($('#template_dialog_content').text()),

	init: function (options) {
		var me = this;

		me.boxEl = me.$('.dialog-catalog-box')[0];
		me.overlayEl = me.$('.dialog-overlay')[0];
		me.$content = me.$('.dialog-catalog-content');
		me.h = 110;
		me.translateY = 230;
		me.speed = 350;
		me.isShowDialog = false;

		me.confirmFn = null;
		me.cancelFn = null;
		me.callbackContext = null;
	},

	showDialog: function (d) {
		var me = this;

		if (!me.isShowDialog) {
			if (!d && !d.content) {
				return;
			}
			me.$content.html(
				me.template(d.content)
			);
			me.confirmFn = d.callback.confirm;
			me.cancelFn = d.callback.cancel;
			me.callbackContext = d.context;

			me.$el.show();
			me.boxEl.style.webkitTransitionDuration = '0ms';
			me.boxEl.style.webkitTransform = 'translate(0px, -' + me.h + 'px)';
			me.boxEl.style.display = 'block';
			me.overlayEl.style.display = 'block';
			
			setTimeout(function () {
				me.boxEl.style.webkitTransitionDuration = me.speed + 'ms';
				me.boxEl.style.webkitTransform = 'translate(0px, ' + me.translateY + 'px)';
				me.isShowDialog = true;
			}, 0);
		}
	},

	hideDialog: function () {
		var me = this;

		if (me.isShowDialog) {
			me.boxEl.style.webkitTransitionDuration = '0ms';
			me.boxEl.style.webkitTransform = 'translate(0px, ' + me.translateY + 'px)';
			
			setTimeout(function () {
				me.boxEl.style.webkitTransitionDuration = me.speed + 'ms';
				me.boxEl.style.webkitTransform = 'translate(0px, -' + me.h + 'px)';
			}, 0);

			setTimeout(function () {
				me.boxEl.style.display = 'none';
				me.overlayEl.style.display = 'none';
				me.$el.hide();
				me.isShowDialog = false;
			}, me.speed);
		}
	},

	onConfirmClick: function () {
		var me = this;

		me.hideDialog();
		if (me.confirmFn instanceof Function) {
			me.confirmFn.apply(me.callbackContext);
		}
	},

	onCancelClick: function () {
		var me = this;

		me.hideDialog();
		if (me.cancelFn instanceof Function) {
			me.cancelFn.apply(me.callbackContext);
		}
	}
});

})(Zepto);