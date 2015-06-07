(function () {

rocket.globalview.sideBar = rocket.globalview.extend({
	el: '#sideBar_globalview',

	template: _.template($('#template_sideBar').text()),

	templateNews: _.template($('#template_sideBar_news').text()),

	events: {
		'click .sideBar-catalog-header': 'onHeaderClick',
		'click .sideBar-catalog-search': 'onSearchClick',
		'click .sideBar-overlay': 'hideSideBar',
		'click .sideBar-catalog-item': 'onItemClick'
	},

	init: function (options) {
		var me = this;

		me.isLogin = window.bdnews.login.isLogin();
		me.$('.sideBar-catalog').prepend(
			me.template({
				isLogin: me.isLogin
			})
		)

		me.overlayEl = me.$('.sideBar-overlay')[0];
		me.catalogEl = me.$('.sideBar-catalog')[0];
		me.wrapperEL = $('#wrapper')[0];
		me.maxWidth = window.innerWidth;
		me.width = 0.875 * me.maxWidth;
		me.isShowSideBar = false;
		me.listHeight = window.innerHeight 
			- me.$('.sideBar-catalog-header').height() 
			- me.$('.sideBar-catalog-footer').height();

		me.$el[0].addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);
	},

	showSideBar: function () {
		var me = this,
			speed = 350;

		if (!me.isShowSideBar) {
			me.$el[0].style.webkitTransitionDuration = '0ms';
			me.$el[0].style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			me.wrapperEL.style.webkitTransitionDuration = '0ms';
			me.wrapperEL.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			me.catalogEl.style.webkitTransitionDuration = '0ms';
			me.catalogEl.style.webkitTransform = 'translate3d(' + (-me.width) + 'px, 0px, 0px)';
			me.overlayEl.style.display = 'none';

			setTimeout(function () {
				me.catalogEl.style.webkitTransitionDuration = speed + 'ms';
				me.catalogEl.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
				me.wrapperEL.style.webkitTransitionDuration = speed + 'ms';
				me.wrapperEL.style.webkitTransform = 'translate3d(' + me.width + 'px, 0px, 0px)';
			}, 0);

			setTimeout(function () {
				me.overlayEl.style.display = 'block';
				me.isShowSideBar = true;
			}, speed);
		}
	},

	hideSideBar: function () {
		var me = this,
			speed = 350;

		if (me.isShowSideBar) {
			me.$el[0].style.webkitTransitionDuration = '0ms';
			me.$el[0].style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			me.catalogEl.style.webkitTransitionDuration = '0ms';
			me.catalogEl.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			me.wrapperEL.style.webkitTransitionDuration = '0ms';
			me.wrapperEL.style.webkitTransform = 'translate3d(' + me.width + 'px, 0px, 0px)';
			me.overlayEl.style.display = 'none';

			setTimeout(function () {
				me.catalogEl.style.webkitTransitionDuration = speed + 'ms';
				me.catalogEl.style.webkitTransform = 'translate3d(' + (-me.width) + 'px, 0px, 0px)';
				me.wrapperEL.style.webkitTransitionDuration = speed + 'ms';
				me.wrapperEL.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			}, 0);

			setTimeout(function () {
				me.$el[0].style.webkitTransitionDuration = '0ms';
				me.$el[0].style.webkitTransform = 'translate3d(-100%, 0, 0)';
				me.wrapperEL.style.webkitTransitionDuration = '0ms';
				me.wrapperEL.style.webkitTransform = 'none';
				me.isShowSideBar = false;
			}, speed);
		}
	},

	delayHideSideBar: function (speed) {
		var me = this;

		me.catalogEl.style.width = me.maxWidth + 'px';
		me.catalogEl.style.webkitTransitionDuration = speed + 'ms';
		me.overlayEl.style.display = 'none';
		
		setTimeout(function () {
			me.catalogEl.style.width = me.width + 'px';
			me.catalogEl.style.webkitTransitionDuration = '0ms';
			me.hideSideBar();
		}, speed + 50);
	},

	onHeaderClick: function (e) {
		switch ($(e.currentTarget).data('act')) {
			case 'login':
				window.bdnews.login.memberLogin();
				break;

			case 'logout':
				window.bdnews.login.memberLogout();
				break;
		}
	},

	onSearchClick: function (e) {
		var me = this,
			speed = 350,
			route = '#search';

		me.delayHideSideBar(speed);
		setTimeout(function () {
			me.navigate(route);
		}, speed + speed + 150);
	},

	onColumnitemClick: function (e) {
		var $el = $(e.currentTarget);

		this.showList($el.index());
	},

	onItemClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			speed = 350,
			page = $el.data('page'),
			pressedClass = 'sideBar-catalog-item-pressed';

		$el.addClass(pressedClass);
		me.delayHideSideBar(speed);

		setTimeout(function () {
			$el.removeClass(pressedClass);
		}, speed + 50);

		setTimeout( function () {
			var param, route, $item, slide;
			switch (page) {
				case 'img':
					var name = $el.data('name');

					if (!name) {
						route = '#img';
					}
					else {
						route = '#imgsearch/' + encodeURIComponent(name);
					}
					me.navigate(route);
					return;
					break;

				case 'video':
					param = encodeURIComponent($el.data('type'));
					if (!param) {
						route = '#' + page;
					}
					else {
						route = '#' + page + '/' + param;
					}
					
					slide = rocket.navSlide.videoSlide;
					$item = $('#video_view_header')
						.find('.nav-item')
						.eq($el.data('index'));
					break;

				case 'index':
				default:
					var act = $el.data('act');

					if (act === 'push' || act === 'collect') {
						route = [
							'#setting',
							encodeURIComponent(act),
							encodeURIComponent($el.data('title'))
						].join('/');

						me.navigate(route);
						return;
					}

					param = [
						encodeURIComponent($el.data('type')),
						encodeURIComponent($el.data('name')),
						encodeURIComponent($el.data('id'))
					].join('/');
					route = '#' + page + '/' + param;
					slide = rocket.navSlide.newsSlide;
					$item = $('#index_view_header')
						.find('.nav-item')
						.eq($el.data('index'));
					break;
			}
			me.navigate(route);
			if (!$item.hasClass('nav-item-focus') && slide instanceof Function) {
				slide($item);
			}
			window.scrollTo(0, 0);
		}, speed + speed + 150);
	},

	showList: function (i) {
		var me = this,
			$list = me.$('.sideBar-catalog-content');
		if (!me.isRenderList) {
			var template,
				minDist,
				tags = (me.isLogin)
					? rocket.tags.newsTag.toJSON().data.tag
					: rocket.tags.newsTag;
			template = me.templateNews;
			$list.append(
				template({
					tags: tags
				})
			);
			me.isRenderList = true;
			minDist = me.listHeight - $list.height();
			if (minDist < 0) {
				$list.touchScroll({
					isCrosswise: false,
					minDist: minDist
				});
			}
		}
		me.showSideBar();
	}
});

})(Zepto);