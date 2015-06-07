(function ($) {

rocket.model.local = rocket.model.extend({
	initialize: function (options) {
		var me = this;
		me.province = options.province;
		me.city = options.city;
	},

	parse: function (res) {
		var me = this;

		if (!res || res.errno) {
			return {};
		}
		return res;
	},

	fetch: function (options) {
		var me = this,
			opt = {
				type: 'POST',
				url: '/news?tn=bdapibaiyue&t=getlocalid&act=get',
				data: {
					province: me.province,
					city: me.city
				}
			};

		return Backbone.Model.prototype.fetch.call(me, opt);
	}
});

})(Zepto);