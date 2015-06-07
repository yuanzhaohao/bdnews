(function ($) {

rocket.model.video = rocket.model.extend({
	initialize: function (options) {
		var me = this;

		me.type = options.type;
		me.start = options.start;
		me.end = options.end;
	},

	getRequest: function () {
		var me = this,
			req = {};

		switch (me.type) {
			case 'tvplay':
			case 'movie':
			case 'tvshow':
			case 'comic':
			case 'micromovie':
				req = me.adwebRequest();
				break;

			case 'amuse':
			case 'game':
			case 'squaredance':
			case 'education':
			case 'yuanchuang':
			case 'music':
			case 'sport':
			case 'yule':
			case 'info':
				req = me.channelRequest();
				break;

			case 'live': 
				req = me.liveRequest();
				break;

			case 'child':
				req = me.childRequest();
				break;

			default:
				req = me.defaultRequest();
				break;
		}
		return req;
	},

	defaultRequest: function () {
		var me = this;

		return {
			method: 'GET',
			url: 'http://app.video.baidu.com/wisehome/?action=iphwebindex&req=withshort&callback=?'
		};
	},

	adwebRequest: function () {
		var me = this;

		return {
			method: 'GET',
			url: 'http://app.video.baidu.com/adweb' 
				+ me.type 
				+ '/?beg=' 
				+ me.start 
				+ '&end=' 
				+ me.end 
				+ '&&callback=?'
		};
	},

	liveRequest: function () {
		var me = this;

		return {
			method: 'GET',
			url: 'http://app.video.baidu.com/adlive/?order=hot&version=999&callback=?'
		};
	},

	channelRequest: function () {
		var me = this;

		return {
			method: 'GET',
			url: 'http://m.baidu.com/video?static=utf8_data/iphone_channel/json/'
				 + me.type 
				 + '/' 
				 + me.end 
				 + '.js&callback=?'
		}
	},

	childRequest: function () {
		var me = this;

		return {
			url: 'http://app.video.baidu.com/hdcomic/?worktype=iphnativechild&beg='
				+ me.start
				+ '&end='
				+ me.end 
				+ '&callback=?'
		};
	},

	parse: function (res) {
		var me = this;

		if (!res) {
			return {};
		}
		me.initData(res);
		return res;
	},

	fetch: function (options) {
		var me = this,
			req = me.getRequest(),
			opt = $.extend({
				type: req.method,
				dataType: 'jsonp',
				url: req.url || ''
			}, options);

		return Backbone.Model.prototype.fetch.call(me, opt);
	},

	initData: function (data) {
		var me = this;

		me.data = data;
		if (!me.type) {
			me.carouselData = data.index_flash;	
		}
	},

	getCarousel: function () {
		return this.carouselData;
	},

	getIndexVideo: function () {
		var me = this,
			video = window.bdnews.conf.getVideoTag();

		$.each(video, function(key, val) {
			val.data = me.data[key];
		});

		return video;
	},

	getVideo: function () {
		var me = this;

		if (!me.data.video_list) {
			return me.data['channel_' + me.type].videos;
		}
		else {
			return me.data.video_list.videos;
		}
	},

	isHasMore: function () {
		var me = this;

		if (me.video_list.pn < (me.end - me.start)) {
			return false;
		}
		return true;
	}
});

})(Zepto);