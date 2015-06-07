(function ($) {

rocket.model.weather = rocket.model.extend({
	initialize: function (options) {
		var me = this;

		me.city = options.city;
	},

	url: function () {
		return '/news?tn=bdapibaiyue&t=weather&act=get';
	},

	parse: function (res, xhr) {
		if (!res) {
			me.trigger('change', me);
			return {};
		}
		return res;
	},

	fetch: function (options) {
		var me = this,
			opt = $.extend({
				type: 'POST',
				data: {
					city: me.city
				}
			});

		return Backbone.Model.prototype.fetch.call(me, opt);
	}
});

})(Zepto);