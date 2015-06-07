(function ($) {

function decode (param) {
	return 'undefined' == typeof param
		? '' 
		// 1.0版本开始，路由参数已经decode
		: parseInt(Backbone.VERSION) < 1
			? decodeURIComponent(param)
			: param;
}

function encode (param) {
	return 'undefined' == typeof param
		? '' 
		: parseInt(Backbone.VERSION) < 1
			? param
			: encodeURIComponent(param);
}

// 获取back参数
var hash = location.hash,
	backAction = hash.split('/')[0],
	ignorePage = ['image', 'comment'];
backAction = (backAction.indexOf('#') >= 0) 
	? backAction.substr(1)
	: backAction;
rocket.back = {
	cur: {
		action: backAction,
		hash: hash
	}
	, last: {
		action: 'index',
		hash: '#index'
	}
};
var check = function (action) {
	if (ignorePage.indexOf(action) !== -1) {
		rocket.back.last = rocket.back.cur;
		rocket.back.cur = {
			action: action,
			hash: location.hash
		};
	}
}
rocket.router.bdnews = rocket.router.extend({

	// 路由配置
	routes: {
		'': 'index',
		'index': 'index',
		'index/': 'index',
		'index/:type': 'index',
		'index/:type/': 'index',
		'index/:type/:name': 'index',
		'index/:type/:name/': 'index',
		'index/:type/:name/:id': 'index',
		'index/:type/:name/:id/': 'index',
		'page/:type/:nid': 'page',
		'page/:type/:nid/': 'page',
		'image/:type/:nid/:id': 'image',
		'image/:type/:nid/:id/': 'image',
		'subscribe': 'subscribe',
		'subscribe/': 'subscribe',
		'subscribe/:type': 'subscribe',
		'subscribe/:type/': 'subscribe',
		'search': 'search',
		'search/': 'search',
		'search/:keyword': 'search',
		'search/:keyword/': 'search',
		'comment': 'comment',
		'comment/': 'comment',
		'comment/:type/:nid': 'comment',
		'comment/:type/:nid/': 'comment',
		'setting/:act': 'setting',
		'setting/:act/': 'setting',
		'setting/:act/:title': 'setting',
		'setting/:act/:title/': 'setting',
		'feedback': 'feedback',
		'feedback/': 'feedback',
		'topic/:zid': 'topic',
		'topic/:zid/': 'topic',
		'*defaultUrl': 'defaultRoute',
	},

	// 页面切换顺序
	pageOrder: [
		'index',
		'topic',
		'setting',
		'search',
		'page',
		'image',
		'comment',
		'feedback'
	],

	defaultPageTransition: 'fade',

	index: function (type, name, id) {
		if (!type) {
			type = 'focus';
		}
		if (!id) {
			id = 0;
		}
		this.doAction('index', {
			type: encode(type),
			name: encode(name),
			id: encode(id)
		});
	},

    page: function (type, nid) {
		if (!type) {
			type = 'info';
		}
		if (!nid) {
			nid = 0;
		}
		this.doAction('page', {
			type: encode(type),
			nid: encode(nid)
		});
	},

	image: function (type, nid, pid) {
		if (!type) {
			type = 'info';
		}
		if (!nid) {
			nid = 0;
		}
		if (!pid) {
			pid = 0;
		}
		this.doAction('image', {
			type: encode(type),
			nid: encode(nid),
			pid: encode(pid)
		});
	},

    subscribe: function (type) {
		if (!type) {
			type = 'tag';
		}
		this.doAction('subscribe', {
			type: encode(type)
		});
	},

	search: function (keyword) {
		if (!keyword) {
			keyword = '';
		}
		this.doAction('search', {
			keyword: encode(keyword)
		});
	},

	comment: function (type, nid) {
		if (!type) {
			type = 'info';
		}
		if (!nid) {
			nid = 0;
		}
		this.doAction('comment', {
			type: encode(type),
			nid: encode(nid)
		});
	},

	setting: function (act, title) {
		if (!act) {
			act = push;
		}
		if (!title) {
			title = '精品推送';
		}
		this.doAction('setting', {
			act: encode(act),
			title: encode(title)
		});
	},

	feedback: function () {
		this.doAction('feedback');
	},

	topic: function (zid) {
		if (!zid) {
			zid = 0;
		}
		this.doAction('topic', {
			zid: encode(zid)
		});
	},

	defaultRoute: function (defaultUrl) {
		Backbone.history.navigate('index', {
			trigger: true, replace: true}
		);
	},

	doAction: function (action, params) {
		rocket.router.prototype.doAction.apply(this, arguments);
		// check(action);
	}

});

})(Zepto);
