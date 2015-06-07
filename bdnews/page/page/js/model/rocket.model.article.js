(function ($) {

rocket.model.article = rocket.model.extend({
	initialize: function (options) {
		var me = this;

		me.type = options.type;
		me.nid = options.nid;
		rocket.model.article._instances
			|| (rocket.model.article._instances = {});

		rocket.model.article._instances[me.nid] = me;
	},

	getRequest: function () {
		var me = this,
			req = {};

		switch (me.type) {
			case 'tag':
			case 'chosen':
			case 'info':
			case 'news':
			case 'author':
			case 'relatednews':
				req = me.tagRequest();
				break;

			case 'focus':
			case 'hotnews':
				req = me.focusRequest(); 
				break;

			case 'local':
				req = me.localRequest();
				break;

			case 'search':
				req = me.searchRequest();
				break;

			case 'focuspic':
				req = me.focuspicRequest();
				break;

			case 'push':
				req = me.pushRequest();
				break;

			default:
				req = me.tagRequest();
				break;
		}
		return req;
	},

	tagRequest: function () {
		var me = this;

		return {
			method: 'POST',
			querystring: '?tn=bdapibaiyue&t=recommendinfo',
			data: {
				mid: '03c7a16f2e8028127e42c5f7ca9e210b',
				nids: me.nid ,
				wf: 1,
				ver: 2
			}
		};
	},

	focusRequest: function () {
		var me = this;

		return {
			method: 'GET',
			data: {
				tn: 'bdapibody',
				type: 1,
				nids: me.nid,
				category: '0' 
			}
		};
	},

	localRequest: function () {
		var me = this;

		return {
			method: 'POST',
			querystring: '?tn=bdapibaiyue&t=localnewsinfo',
			data: {
				mid: '03c7a16f2e8028127e42c5f7ca9e210b',
				nids: me.nid,
				wf: 1,
				ver: 2
			}
		};
	},

	searchRequest: function () {
		var me = this;

		return {
			method: 'GET',
			data: {
				tn: 'bdapitext',
				src: decodeURIComponent(me.nid)
			}
		};
	},

	focuspicRequest: function () {
		var me = this;

		return {
			method: 'GET',
			data: {
				tn: 'bdapibody',
				type: 2,
				nids: me.nid || '',
				category: '0' 
			}
		};
	},

	pushRequest: function () {
		var me = this;

		return {
			method: 'POST',
			querystring: '?tn=bdapibaiyue&t=getpushnews&act=get',
			data: {
				nid: me.nid
			}
		};
	},

	parse: function (res) {
		var me = this;

		if (!res) {
			return {};
		}
		return res;
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
	},

	getImages: function () {
		var me = this,
			content = me.formatData().content,
			data = [],
			origin = [];

		content.forEach(function (item, index) {
			if (item.type === 'image') {
				data.push({
					url: item.data.big.url || item.data.big,
					width: item.data.big.width || 0,
					height: item.data.big.height || '50%'
				});
				origin.push({
					url: item.data.original.url || item.data.original,
					width: item.data.original.width || 0,
					height: item.data.original.height || 0
				});
			}
		});
		return {
			data: data,
			origin: origin
		};
	},

	formatData: function () {
		var me = this,
			data = me.toJSON();

		if (me._formatData) {
			return me._formatData;
		}
		data = data.data
			&& data.data.news
			&& data.data.news.length
				? data.data.news[0]
				: data;

		var time = data.time || data.ts;
		var formatData = {
				nid: data.nid,
				title: data.title,
				time: me.formatTime(
					time.length < 13 
						? time + '000' 
						: time
					,'yyyy年MM月dd日 hh时mm分'
				),
				author: data.site,
				content: data.content,
				video: data.video,
				isVideo: data.isVideo || 0,
				url: data.url,
				related: data.related || [],
				tag: data.tag || []
			};

		me._formatData = formatData;
		return formatData;
	},

	formatTime: function (n, format) {
		var date = new Date(parseInt(n, 10)),
			o = {
				'M+': date.getMonth() + 1,
				'd+': date.getDate(),
				'h+': date.getHours(),
				'm+': date.getMinutes(),
				's+': date.getSeconds(),
				'q+': Math.floor((date.getMonth() + 3) / 3),
				'S': date.getMilliseconds()
			};

		if (/(y+)/.test(format)) {
			format = format.replace(
				RegExp.$1, 
				(date.getFullYear() + '').substr(4 - RegExp.$1.length)
			);
		}

		for (var k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(
					RegExp.$1, 
					RegExp.$1.length === 1 
						? o[k] 
						: ('00' + o[k]).substr(('' + o[k]).length)
					);
			}
		}
		return format;
	}
});

rocket.model.article.getInstance = function (id) {
	var instances = rocket.model.article._instances;
	return instances && instances[id];
}

})(Zepto);