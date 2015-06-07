(function ($) {

rocket.model.topic = rocket.model.extend({
	initialize: function (options) {
		this.zid = options.zid;
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
				url: '/news?tn=bdapibaiyue&t=getzinfo&act=get',
				data: {
					z_id: me.zid
				}
			};

		return Backbone.Model.prototype.fetch.call(me, opt);
	}
});

})(Zepto);