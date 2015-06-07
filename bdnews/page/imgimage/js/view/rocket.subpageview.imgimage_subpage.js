(function ($) {

rocket.subpageview.imgimage_subpage = rocket.subpageview.extend({
	className: 'imgimage-view-subpage',

	events: {
	},

	init: function (options) {
		var me = this;

		me.hideLoading(me.$el);
	},

	onsubpagebeforechange: function (params) {
		var me = this,
			to = params.to,
			param = params.params,
			featureString = me.getFeatureString(param);
		
		if (to == me.ec) {
			if (me.featureString == featureString) {
				if (me.isFirstLoad) {
					var imgsearch = rocket.model.imgsearch.getInstance(param.keyword);

					if (!imgsearch) {
						imgsearch = new rocket.model.imgsearch({
							word: param.keyword,
							pn: 0,
							rn: 20
						});
						imgsearch.fetch({
							success: function (model) {
								me.render();
							}
						})
					}
					else {
						me.render();
					}
					me.isFirstLoad = false;
				}
				me.$el.show();
			}
		}
	},

	render: function (model) {
		var me = this;

		
	}
});

})(Zepto);