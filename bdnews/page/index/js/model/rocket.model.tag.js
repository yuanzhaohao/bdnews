(function ($) {

rocket.model.tag = rocket.model.extend({
	initialize: function (options) {
		var me = this;

		me.bduss = options.bduss;
		rocket.model.tag._instances
			|| (rocket.model.tag._instances = {});

		rocket.model.tag._instances[options.bduss] = me;
	},

	url: function () {
		return '/news?tn=bdapibaiyue&t=getuserdata';
	},

	parse: function (res, xhr) {
		if (!res) {
			this.trigger('change', this);
			return {};
		}
		return res;
	},

	fetch: function (options) {
		var me = this,
			opt = $.extend({
				type: 'POST',
				data: {
					bduss: me.bduss || '',
					cuid: 1,
					type: 'tag',
					OS: 'webapp',
					ver: 2,
					rand: new Date().getTime()
				}
			});

		return Backbone.Model.prototype.fetch.call(me, opt);
	},

	formatData: function () {
		var me = this,
			data = me.toJSON();

		if (me._formatData) {
			return me._formatData;
		}
		

		me._formatData = data;
		return data;
	}
});

rocket.model.tag.getInstance = function (id) {
	var instances = rocket.model.tag._instances;
	return instances && instances[id];
}

})(Zepto);