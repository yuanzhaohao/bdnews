(function ($) {

rocket.pageview.index = rocket.pageview.extend({
	el: '#index_view',
	
	init: function (options) {
		var me = this;
		
		me.setup(new rocket.subview.index_header(
			options,
			me
		));

		me.setup(new rocket.subview.index_content(
			options,
			me
		));

		me.setup(new rocket.subview.index_footer(
			$.extend({
				page: 'index'
			}, options),
			me
		));
	}

});

})(Zepto);