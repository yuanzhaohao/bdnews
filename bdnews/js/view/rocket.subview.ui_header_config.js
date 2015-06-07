(function () {

rocket.subview.ui_header_config = rocket.subview.extend({
	className: 'ui-header-config',

	events: {
		'click .ui-header-config': 'onConfigClick',
		'click .ui-config-item-share': 'onShareClick',
		'click .ui-config-item-comment': 'onCommentClick',
		'click .ui-config-item-write': 'onWriteClick',
		'click .ui-config-item-collect': 'onCollectClick',
		'click .ui-config-item-collected': 'onCollectedClick',
		'click .ui-config-item-origin': 'onOriginClick'
	},

	template: _.template($('#template_ui_header_config').text()),

	templateCollect: _.template($('#template_config_collect').text()),

	init: function (options) {
		var me = this;
		var collects = window.bdnews.collect.getCollectArticle(),
			classes = ['ui-config-item-share'];

		switch (options.page) {
			case 'page':
				classes.push(
					'ui-config-item-write', 
					'ui-config-item-comment'
				);
				if ($.inArray(options.nid.toString(), collects) >= 0) {
					classes.push('ui-config-item-collected');
				}
				else {
					classes.push('ui-config-item-collect');
				}
				break;
			case 'image':
				classes.push('ui-config-item-origin');
				break;
		}
		me.$el.html(
			me.template({
				classes: classes,
				page: options.page
			})
		);

		me.$config = me.$('.ui-header-config');
		me.$list = me.$('.ui-config-list');
		me.isShowList = false;

		me.show();
	},

	showConfig: function () {
		var me = this;

		me.$config.addClass('ui-config-pressed');
		me.$list.show();
		me.isShowList = true;
	},

	hideConfig: function () {
		var me = this;

		me.$config.removeClass('ui-config-pressed');
		me.$list.hide();
		me.isShowList = false;
	},

	onConfigClick: function (e) {
		var me = this;

		if (!me.isShowList) {
			me.showConfig();
		}
		else {
			me.hideConfig();
		}
	},

	onShareClick: function (e) {
		var me = this;

		me.hideConfig();
		rocket.share.showShare();
	},

	onCommentClick: function (e) {
		var me = this;

		me.hideConfig();
		me.subec.trigger('goToComment');
	},

	onWriteClick: function (e) {
		var me = this;

		me.hideConfig();
		me.subec.trigger('scrollToTextarea');
	},

	onCollectClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			$parent = $el.parent();

		me.hideConfig();
		me.subec.trigger('collect');
		$parent.append(
			me.templateCollect({
				className: 'ui-config-item-collected'
			})
		);
		$el.remove();
	},

	onCollectedClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			$parent = $el.parent();

		me.hideConfig();
		me.subec.trigger('collected');
		$parent.append(
			me.templateCollect({
				className: 'ui-config-item-collect'
			})
		);
		$el.remove();
	},

	onOriginClick: function (e) {
		var me = this;

		me.hideConfig();
		me.subec.trigger('goOrigin');
	}
});

})(Zepto);