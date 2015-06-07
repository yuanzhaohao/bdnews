(function ($) {

rocket.subpageview.topic_content_subpage = rocket.subpageview.extend({
	className: 'topic-view-subpage',

	events: {
		'click .ui-news-item': 'onItemClick',
		'click .topic-page': 'onItemClick',
		'click .topic-text-item': 'onItemClick',
		'click .topic-gallery-item': 'onItemClick'
	},

	template: _.template($('#template_topic_subpage').text()),

	init: function (options) {
		var me = this;

		me.type = options.type;
		me.nid = options.nid;
		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;

		me.showLoading(me.$el);
		me.model = new rocket.model.topic(
			$.extend({}, options)
		);
	},

	registerEvents: function () {
		var me = this,
			ec = me.ec;

		ec.on('subpagebeforechange', me.onsubpagebeforechange, me);
		me.model.on('change', me.render, me);
	},

	unregisterEvents: function () {
		var me = this,
			ec = me.ec;

		ec.off('subpagebeforechange', me.onsubpagebeforechange, me);
		me.model.off('change', me.render, me);
	},

	render: function (model) {
		var me = this,
			data = model.toJSON().data,
			galleryIds = [];

		me.ec.trigger('changeTitle', data.title);
		me.$el.html(me.template(data));
		setTimeout(function () {
			me.$('.topic-lazyload').scrollLazyload({
				isFade: true
			});
		}, 150);
		
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