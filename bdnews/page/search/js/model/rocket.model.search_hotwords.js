(function ($) {

rocket.model.search_hotwords = rocket.model.extend({
	initialize: function (options) {
		var me = this;

		me.requestParams = {
			tn: 'bdcmssearchbox'
		};

		me.type = options.type;
	},

	getRequest: function () {
		var me = this,
			req = {};

		switch (me.type) {
			case 'video':
				break;
			case 'img':
				break;
			case 'news':
			default:
				req = me.newsRequest();
				break;
		}
		return req;
	},

	newsRequest: function () {
		var me = this;

		return {
			method: 'GET',
			data: {
				tn: 'bdcmssearchbox'
			}
		};
	},

	parse: function (res) {
		if (!res || res.errno) {
			return {};
		}
		return res.data || res;
	},

	fetch: function (options) {
		var me = this,
			req = me.getRequest(),
			opt = $.extend({
				type: req.method,
				url: '/news' + (req.querystring || ''),
				data: req.data
			}, options);

		return Backbone.Model.prototype.fetch.call(me, opt);
	}
});

})(Zepto);