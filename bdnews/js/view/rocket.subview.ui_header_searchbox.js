(function ($) {

rocket.subview.ui_header_searchbox = rocket.subview.extend({
	className: 'ui-header-searchbox',

	template: _.template($('#template_header_searchbox').text()),

	events: {
		'keyup .ui-search-input': 'onInputKeyup',
		'click .ui-search-setting-close': 'onSettingCloseClick',
		'click .ui-search-setting-clear': 'onSettingClearClick',
		'click .ui-search-edit': 'onEditClick',
		'click .ui-search-close': 'onCloseClick',
		'click .ui-search-btn': 'onBtnClick',
		'click .ui-search-item': 'onItemClick'
	},

	init: function (options) {
		var me = this;

		me.$el.html(me.template());

		me.page = options.page;
		me.$input = me.$('.ui-search-input');
		me.$close = me.$('.ui-search-close');
		me.$tips = me.$('.ui-search-tips');
		me.$list = me.$('.ui-search-list');
		me.$settingClose = me.$('.ui-search-setting-close');
		me.$settingClear = me.$('.ui-search-setting-clear');
		me.addEvents();
		me.show();
	},

	addEvents: function () {
		var me = this;

		me.$input[0].addEventListener('focus', function (e) {
			me.onInputFocus(e);
		}, false);
	},

	onInputKeyup: function (e) {
		var me = this,
			v = me.$input.val();

		if (!!v) {
			me.$close.show();
			// 节流处理
			window.bdnews.helper.throttle(me.sendJSONP, me, 250, [v]);
		}
		else {
			me.$close.hide();
			me.buildHistory();
		}
	},

	onInputFocus: function (e) {
		var me = this,
			v = $(e.currentTarget).val();

		me.$tips.show();
		if (!!v) {
			me.$close.show();
		}
		else {
			me.$close.hide();
			me.buildHistory();
		}
	},

	onInputBlur: function (e) {
		$(e.currentTarget).siblings('.ui-search-tips').hide();
	},

	onSettingCloseClick: function (e) {
		this.$tips.hide();
	},

	onSettingClearClick: function (e) {
		var me = this;

		me.onSettingCloseClick();
		if (me.page === 'search') {
			window.bdnews.search.clearSearchHistory();
		}
		else if (me.page === 'imgsearch') {
			window.bdnews.search.clearImgSearchHistory();
		}
	},

	onEditClick: function (e) {
		var me = this,
			w = $(e.currentTarget).data('word');

		me.$input.val(w);
		me.sendJSONP(w);
	},

	onCloseClick: function (e) {
		var me = this;

		me.$input.val('');
		me.$tips.hide();
		me.$close.hide();
		me.$list.html('');
	},

	onBtnClick: function (e) {
		var me = this,
			v = me.$input.val();

		if (!!v) {
			me.$input.val('');
			me.$tips.hide();
			me.navigate('#' + me.page + '/' + encodeURIComponent(v));
		}
	},

	onItemClick: function (e) {
		var me = this,
			w = $(e.currentTarget).data('word');

		if (!!w) {
			me.$tips.hide();
			if (me.page === 'search') {
				window.bdnews.search.setSearchHistory(w);
			}
			else if (me.page === 'imgsearch') {
				window.bdnews.search.setImgSearchHistory(w);
			}
			
			me.navigate('#' + me.page + '/' + encodeURIComponent(w));
		}
	},

	buildHtml: function (list, q) {
		var me = this,
			h = '';

		if (!q) {
			q = '';
		}
		if (list instanceof Array && list.length > 0) {
			list.forEach(function (v, k) {
				if (k < 7) {
					h += '<li class="ui-search-item" '
							+ 'data-word="' + v 
						+ '">' 
						+ (!!q 
							? v.replace(q, '<span>' + q + '</span>')
							: v)
						+ '<div class="ui-search-edit" data-word="'
							+ v
						+ '"></div></li>';
				}
			});
			me.$list.html(h);
		}
	},

	sendJSONP: function (v) {
		var me = this,
			t = new Date().getTime();

		me.$tips.show();
		me.$settingClear.hide();
		if (!!v) {
			$.ajax({
				url: 'http://m.baidu.com/su?p=3&ie=utf-8&from=wise_web'
					+ '&wd=' + encodeURIComponent(v)
					+ '&t=' + t
					+ '&cb=?',
				type: 'GET',
				dataType: 'jsonp',
				success: function (data) {
					var q = data.q,
						r = [];
					if (data.s.length) {
						me.buildHtml(data.s, q);
					}
				}
			});
		}
	},

	buildHistory: function () {
		var me = this;

		if ((window.bdnews.search.isSearchHistory() && me.page === 'search')
			|| (window.bdnews.search.isImgSearchHistory() && me.page === 'imgsearch')) {
			if (me.page === 'search') {
				me.buildHtml(window.bdnews.search.getSearchHistory());
			}
			else if (me.page === 'imgsearch') {
				me.buildHtml(window.bdnews.search.getImgSearchHistory());
			}
			me.$settingClear.show();
		}
		else {
			me.$tips.hide();
		}
	}

});

})(Zepto);