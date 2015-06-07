(function ($) {
	$.extend(rocket, {
		init: function () {
			function scroll(e) {
				rocket.$pageLoading = $('#wrapper .page-loading');

				// 导航数据
				var newsTag,
					newsTagKey = {};
				if (window.bdnews.login.isLogin()) {
					newsTag = new rocket.model.tag({
						bduss: window.bdnews.login.getBDUSS()
					});
					newsTag.once('change', function (model) {
						var tags = model.toJSON().data.tag,
							i;
						window.bdnews.conf.saveNewsTag(tags);
						i = tags.length;
						while (i--) {
							newsTagKey[tags[i].name] = true;
						}
					});
					newsTag.fetch();
				}
				else {
					newsTag = window.bdnews.conf.getTagDefault();
				}
				rocket.navSlide = {};
				rocket.tags = {};
				rocket.tags.newsTag = newsTag;
				rocket.tags.newsTagKey = newsTagKey;
				rocket.tags.videoTag = window.bdnews.conf.getVideoTag();
				rocket.tags.imgTag = window.bdnews.conf.getImgTag();

				var router = new rocket.router.bdnews();
				Backbone.history.start();

				new rocket.globalview.jumphelper({}, router);
				rocket.share = new rocket.globalview.share({}, router);
				rocket.tip = new rocket.globalview.tip({}, router);
				rocket.dialog = new rocket.globalview.dialog({}, router);
				rocket.sideBar = new rocket.globalview.sideBar({}, router);

				setTimeout(function () {
					window.scrollTo(0, 0);
					rocket.isLoaded = true;
				}, 450);
			}

			$(document).ready(function () {
				scroll();
			});
		}
	});
})(Zepto);