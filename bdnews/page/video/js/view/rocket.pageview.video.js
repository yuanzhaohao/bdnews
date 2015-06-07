(function ($) {

rocket.pageview.video = rocket.pageview.extend({
	el: '#video_view',

	init: function (options) {
		var me = this;

		me.setup(new rocket.subview.video_footer(
			$.extend({
				page: 'video'
			}, options),
			me
		));
		
		me.setup(new rocket.subview.video_header(
			$.extend({
				data: window.bdnews.conf.getVideoTag()
			}, options),
			me
		));

		me.setup(new rocket.subview.video_content(
			options,
			me
		));
	}
});

})(Zepto);