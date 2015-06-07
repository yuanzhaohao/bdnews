(function ($) {

rocket.subpageview.page_content_subpage = rocket.subpageview.extend({
	className: 'page-view-subpage',

	events: {
		'click .page-article-img': 'onImgClick',
		'click .page-related-item': 'onRelatedClick',
		'click .page-article-video': 'onVideoClick'
	},

	template: _.template($('#template_page_subpage').text()),

	init: function (options) {
		var me = this;

		me.type = options.type;
		me.nid = options.nid;
		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;
		me.model = new rocket.model.article(
			$.extend({}, options)
		);
		me.showLoading(me.$el);
	},

	registerEvents: function () {
		var me = this,
			subec = me.subec;

		me.model.on('change', me.render, me);
		subec.on('scrollToTextarea', me.onScrollToTextarea, me);
		subec.on('goToComment', me.onGoToComment, me);
		subec.on('collect', me.onCollect, me);
		subec.on('collected', me.onCollected, me);
	},

	unregisterEvents: function () {
		var me = this,
			subec = me.subec;

		me.model.off('change', me.render, me);
		subec.off('scrollToTextarea', me.onScrollToTextarea, me);
		subec.off('goToComment', me.onGoToComment, me);
		subec.off('collect', me.onCollect, me);
		subec.off('collected', me.onCollected, me);
	},

	render: function (model) {
		var me = this;
		
		me.$el.prepend(me.template(
			model.formatData()
		));
		me.$('.page-article-lazyload').scrollLazyload({
			threshold: 100
		});

		me.prepend(
			new rocket.subview.ui_header_config({
				page: 'page',
				nid: me.nid,
				type: me.type
			}, me)
			, me.$el
		);

		if (!!me.nid && !!me.type && me.type !== 'search') {
			me.appendTo(
				new rocket.subview.page_subpage_comment({
					nid: me.nid,
					type: me.type
				}, me)
				, me.$('.page-comment-box')
			);
		}
		me.hideLoading(me.$el);
	},

	onsubpagebeforechange: function (params) {
		var me = this, 
			from = params.from,
			to = params.to,
			param = params.params,
			featureString = me.getFeatureString(param);

		if (to == me.ec) {
			if (me.featureString == featureString) {
				if (me.isFirstLoad) {
					me.model.fetch({
						success: function () {
							me.isFirstLoad = false;
						}
					});
				}

				me.$el.show();
			}
		}
	},

	onScrollToTextarea: function () {
		var me = this;

		window.scrollTo(0, me.$('.page-title').offset().top - 45);
		me.$('.comment-textarea').focus();
	},

	onGoToComment: function () {
		var me = this;

		me.navigate([
			'#comment',
			me.options.type,
			me.options.nid
		].join('/'));
	},

	onCollect: function () {
		var me = this,
			nid = me.nid;

		if (me.type !== 'collect' && /^[0-9]*$/.test(nid)) {
			window.bdnews.collect.setCollectArticle(nid);
			rocket.tip.showTip('收藏成功');
		}
	},

	onCollected: function () {
		var me = this,
			nid = me.nid;

		if (me.type !== 'collect' && /^[0-9]*$/.test(nid)) {
			window.bdnews.collect.removeCollectArticle(nid);
			rocket.tip.showTip('取消收藏成功');
		}
	},

	onImgClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			route = [
				'#image',
				me.type,
				$el.data('nid'),
				$el.data('index')
			].join('/');

		me.navigate(route);
	},

	onRelatedClick: function (e) {
		var me = this,
			$el = $(e.currentTarget);

		me.navigate([
			'#page',
			$el.data('type'),
			$el.data('nid')
		].join('/'));
	},

	onVideoClick: function (e) {
		window.location.href = $(e.currentTarget).data('url');
	}
});

})(Zepto);