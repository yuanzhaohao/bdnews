(function ($) {

rocket.subview.subscribe_list = rocket.subview.extend({
	el: '#subscribe_view_list',

	events: {
        'click .subscribe-item': 'onItemClick'
	},

	template: _.template($('#template_subscribe_list').text()),

	init: function (options) {
		var me = this;

		me.show();
		me.model = rocket.tags.newsTag;
		me.isLogin = window.bdnews.login.isLogin();
		me.isFirstRender = true;
		if (!me.isLogin) {
			me.tags = me.model;
			me.render();
		}
		else if (!!me.model.toJSON().data) {
			me.tags = me.model.toJSON().data.tag;
			me.render();
		}
		else {
			me.showLoading(me.$el);
			me.isFetchData = true;
		}
	},

	registerEvents: function () {
		var me = this;

		if (me.isLogin) {
			me.model.on('change', me.render, me);
		}
	},

	unregisterEvents: function () {
		var me = this;

		if (me.isLogin) {
			me.model.off('change', me.render, me);
		}
	},

	render: function (model) {
		var me = this;

		if (me.isFirstRender) {
			var tags = (me.isFetchData)
				? me.model.toJSON().data.tag
				: me.tags;
			
			me.isFirstRender = false;
			me.tags = tags;

			me.$('.subscribe-list-inner').html(
				me.template({
					tags: tags
				})
			);
		}
	},

    onItemClick: function (e) {
        var me = this,
            $el = $(e.currentTarget),
            type = $el.data('type'),
            name = decodeURIComponent($el.data('name')),
            tags = rocket.tags.newsTag,
            tagsKey = rocket.tags.newsTagKey;

        $el.hide();
    }
});

})(Zepto);
