(function ($) {

rocket.subpageview.subscribe_content_subpage = rocket.subpageview.extend({
	className: 'subscribe-view-subpage',

	events: {

	},

	template: _.template($('#template_subscribe_subpage').text()),

	init: function (options) {
		var me = this;

		me.type = options.type;
		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;
		me.isFirstRender = true;
		me.model = new rocket.model.subscribe(
			$.extend({}, options)
		);
		me.showLoading(me.$el);
	},

	registerEvents: function () {
		var me = this,
            ec = me.ec;

		me.model.on('change', me.render, me);
	},

	unregisterEvents: function () {
		var me = this;

		me.model.off('change', me.render, me);
	},

	render: function (model) {
		var me = this,
			tags = model.toJSON()[me.type];
		
		if (me.isFirstRender) {
			setTimeout(function () {
				me.$el.html(
					me.template({
						tagKey: rocket.tags.newsTagKey,
						tags: tags
					})
				);
				me.hideLoading(me.$el);
			}, 300);
			me.isFirstRender = false;
		}
		else {
			me.$el.html(
				me.template({
					tagKey: rocket.tags.newsTagKey,
					tags: tags
				})
			);
			me.hideLoading(me.$el);
		}
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

                me.ec.trigger('changeCurTag', me.type);
				me.$el.show();
			}
		}
	}

});

})(Zepto);
