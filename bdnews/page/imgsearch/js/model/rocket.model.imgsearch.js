(function ($) {

rocket.model.imgsearch = rocket.model.extend({
	
	initialize: function (options) {
		var me = this;

		me.word = options.word;
		me.pn = options.pn;
		me.rn = options.rn;
	},

	url: function () {
		var me = this;

		return '/img?tn=bdjsonapp&pu=sz%401320_2001&bd_page_type=1&change=1&&&word=' 
			+ me.word 
			+ '&pn='
			+ me.pn
			+ '&rn='
			+ me.rn;
	},

	parse: function (res) {
		var me = this,
			data = {};

		if (res) {
			data = res;
		}
		me.data = data;
		me.initData();
		return data;
	},

	fetch: function (options) {
		var me = this,
			opt;

		opt = $.extend({
			type: 'GET'
		}, options);

		return Backbone.Model.prototype.fetch.call(me, opt);
	},

	getImgs: function () {
		return this.data.data;
	},

	getQuery: function () {
		return this.data.referQuery;
	},

	initData: function () {
		var me = this;
		
		rocket.model.imgsearch._instances
			|| (rocket.model.imgsearch._instances = {});

		rocket.model.imgsearch._instances[me.word] = me;
	}
});

rocket.model.imgsearch.getInstance = function (id) {
	var instances = rocket.model.imgsearch._instances;
	return instances && instances[id];
}

})(Zepto);