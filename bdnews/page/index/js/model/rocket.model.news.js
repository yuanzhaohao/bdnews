(function ($) {

rocket.model.news = rocket.model.extend({
	initialize: function (options) {
		var me = this;

		me.type = options.type;
		me.name = options.name;
		me.pn = options.pn || 20;
		me.id = options.id || 0;
		me.isFirstLoad = true;
		me.isCacheNews = false;
		me.dataCache = [];
		me.dataNids = '';
		me.dataFocus = [];
	},

	getRequest: function () {
		var me = this,
			req = {};

		switch (me.type) {
			case 'tag':
			case 'chosen':
			case 'info':
				req = me.tagRequest();
				break;
			case 'local':
				req = me.localRequest();
				break;
			case 'news':
				req = me.subscribeRequest();
				break;
			case 'author':
				req = me.authorRequest();
				break;
			case 'search':
				req = me.searchRequest();
				break;
			case 'push':
				req = me.pushRequest();
				break;
			case 'collect':
				req = me.collectRequest();
				break;
			default:
				req = me.focusRequest();
				break;
		}
		return req;
	},

	focusRequest: function () {
		var me = this;

		me.isCacheNews = false;
		return me.isFirstLoad
			? {
				method: 'GET',
				data: {
					tn: 'bdapilist',
					category: 0,
					ln: 20,
					an: 20,
					from: 'news_webapp',
					soe: 1
				}
			}
			: {
				method: 'GET',
				data: {
					tn: 'bdapirecommend',
					category: 0,
					wf: 0,
					ts: me.dataTS,
					from: 'news_webapp',
					soe: 1,
					time: me.dataTS
				}
			}
	},

	tagRequest: function () {
		var me = this;

		me.isCacheNews = true;
		return me.isFirstLoad 
			? {
				method: 'POST',
				querystring: '?tn=bdapibaiyue&t=recommendlist',
				data: {
					mid: '03c7a16f2e8028127e42c5f7ca9e210b',
					ts: 0,
					topic: decodeURIComponent(me.name), 
					type: me.type,
					token: me.type, 
					ln: 200,
					an: me.pn,
					withtopic: 0,
					wf: 0,
					'internet-subscribe': 0,
					ver: 4
				}
			}
			: {
				method: 'POST',
				querystring: '?tn=bdapibaiyue&t=recommendinfo',
				data: {
					mid: '03c7a16f2e8028127e42c5f7ca9e210b',
					nids: '',
					wf: 0,
					ver: 2
				}
			}
	},

	localRequest: function () {
		var me = this;

		me.isCacheNews = true;
		return me.isFirstLoad
			? {
				method: 'POST',
				querystring: '?tn=bdapibaiyue&t=localnewslist',
				data: {
					mid: '03c7a16f2e8028127e42c5f7ca9e210b',
					loc: me.id || 0, 
					ln: 200,
					an: me.pn,
					wf: 0,
					ver: 2
				}
			}
			: {
				method: 'POST',
				querystring: '?tn=bdapibaiyue&t=localnewsinfo',
				data: {
					mid: '03c7a16f2e8028127e42c5f7ca9e210b',
					nids: '',
					wf: 0,
					ver: 2
				}
			}
	},

	subscribeRequest: function () {
		var me = this;

		me.isCacheNews = true;
		return me.isFirstLoad
			? {
				method: 'POST',
				querystring: '?tn=bdapibaiyue&t=subscribenewslist',
				data: {
					os: 'android',
					ts: 0,
					sourceid: me.id ,
					installmentid: 0,
					ln: 200,
					an: me.pn,
					wf: 0,
					ver: 3
				}
			}
			: {
				method: 'POST',
				querystring: '?tn=bdapibaiyue&t=recommendinfo',
				data: {
					mid: '03c7a16f2e8028127e42c5f7ca9e210b',
					nids: '',
					wf: 0,
					ver: 2
				}
			}
	},

	authorRequest: function () {
		var me = this;

		me.isCacheNews = false;
		return {
			method: 'POST',
			querystring: '?tn=bdapibaiyue&t=getcolumnnews',
			data: {
				rn: me.pn,
				id: me.id,
				wf: 0,
				time: 0
			}
		};
	},

	searchRequest: function () {
		var me = this;

		if (me.isFirstLoad) {
			me.searchPn = 0;
		}
		else {
			me.searchPn += me.pn;
		}
		me.isCacheNews = false;
		return {
			method: 'POST',
			querystring: '?tn=bdapibaiyue&t=searchnews&act=get',
			data: {
				word: decodeURIComponent(me.name),
				rn: me.pn,
				pn: me.searchPn
			}
		}
	},

	pushRequest: function () {
		var me = this;

		me.isCacheNews = false;
		return me.isFirstLoad
			? {
				method: 'GET',
				querystring: '?tn=bdapibaiyue&t=getpushlist',
				data: {
					time: new Date().getTime(),
					rn: me.pn,
					wf: 1
				}
			}
			: {
				method: 'GET',
				querystring: '?tn=bdapibaiyue&t=getpushlist',
				data: {
					time: me.dataTS,
					rn: me.pn,
					wf: 1
				}
			}
	},

	collectRequest: function () {
		var me = this;

		me.isCacheNews = true;
		me.dataNids = window.bdnews.collect.getCollectArticle().join(',');
		return {
			method: 'POST',
			querystring: '?tn=bdapibaiyue&t=recommendinfo',
			data: {
				mid: '03c7a16f2e8028127e42c5f7ca9e210b',
				nids: '',
				wf: 0,
				ver: 2
			}
		};
	},

	parse: function (res) {
		var me = this,
			data;

		if (!res || res.errno) {
			me.isDataList = true;
			return {};
		}
		data = res.data || res;
		me.initData(data);
		return data;
	},

	fetch: function (options) {
		var me = this,
			req = me.getRequest(),
			opt = $.extend({
				type: req.method,
				url: '/news' + (req.querystring || ''),
				data: (me.dataNids === '') 
					? $.extend(req.data, {
						ts: me.dataTS,
						time: me.dataTS
					})
					: $.extend(req.data, {
						nids: me.dataNids
					})
			}, options);

		return Backbone.Model.prototype.fetch.call(me, opt);
	},

	initData: function (data) {
		var me = this,
			arrNids = [],
			arrCache,
			news = data.news instanceof Array
				? data.news
				: data.column[0].news instanceof Array
					? data.column[0].news
					: [];

		me.dataTS = data.st || data.ts || me.dataTS;
		if (me.isCacheNews) {
			if (me.isFirstLoad) {
				me.dataCache = news;
			}
			else {
				for (var i = 0, len = news.length; i < 20 && i < len; i++) {
					me.dataCache[i] = news[i];
				}
			}
		}
		else {
			me.dataCache = news;
		}

		arrCache = me.dataCache;
		for (var i = me.pn, len = arrCache.length; i < (2 * me.pn) && i < len; i++) {
			arrNids.push(arrCache[i].nid);
		}
		me.dataNids = arrNids.join(',');

		if (data.focus_pic instanceof Array) {
			me.dataFocus = data.focus_pic;
		}

		arrNids = null;
		news = null;
	},

	getNews: function () {
		var me = this,
			news;

		me.isFirstLoad = false;
		news = this.dataCache.splice(0, me.pn);
		return news;
	},

	getFocus: function () {
		return this.dataFocus;
	}

});

})(Zepto);