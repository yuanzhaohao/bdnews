(function ($) {

rocket.model.comment = rocket.model.extend({
	initialize: function (options) {
		var me = this,
			matchObj = {
				info: true,
				focus: true,
				toppic: true,
				push: true,
				search: true
			};
		
		me.options = options;
		me.t = options.t || 'comment';

		if (!matchObj[options.type]) {
			me.options.type = 'info';
		}
	}

	,url: function () {
		var me = this,
			act = 'get';

		if (me.t === 'comment' || me.t === 'support') {
			act = 'post';
		}

		return '/news?tn=bdapibaiyue&t=' + me.t + '&act=' + act;
	}

	,parse: function (res) {
		var me = this;

		if (!res) {
			return {};
		}
		return res;
	}

	,fetch: function (options) {
		var me = this,
			data = {
				nid: me.options.nid,
				from: me.options.type
			};

		switch (me.t) {
			case 'getcomments':
				data = $.extend(data, {
					comment_id: options.startComment || 0,
					order: 'time',
					pn: me.options.pn || 20
				});
				break;
			case 'getcommentcount':
				break;
			case 'comment':
				data = $.extend(data, {
					text: me.options.text,
					bduss: me.options.bduss
				});
				break;
			case 'support':
				data = $.extend(data, {
					comment_id: me.options.comment_id,
					cuid: me.options.cuid
				});
				break;
		}

		var opt = $.extend({
				type: 'POST',
				data: data
			}, options);

		return Backbone.Model.prototype.fetch.call(me, opt);
	}
});

})(Zepto);