(function ($) {

rocket.subview.page_subpage_comment = rocket.subview.extend({
	className: 'page-comment',

	events: {
		'click .ui-refresh': 'onLoadMoreClick',
		'click .comment-post-btn': 'onPostClick',
		'click .comment-nologin': 'onLoginClick'
	},

	templateBox: _.template($('#template_comment_box').text()),

	templateCount: _.template($('#template_comment_count').text()),

	templateRefresh: _.template($('#template_comment_refresh').text()),

	init: function (options) {
		var me = this;
		
		me.isFirstRender = true;
		me.isLogin =  window.bdnews.login.isLogin();
		me.pn = 5;
		me.options = options;
		me.model = new rocket.model.comment(
			$.extend({
				t: 'getcomments',
				pn: me.pn
			}, options)
		);

		me.model.fetch({
			startComment: 0
		});
	},

	registerEvents: function () {
		var me = this;

		me.model.on('change', me.render, me);
	},

	unregisterEvents: function () {
		var me = this;

		me.model.off('change', me.render, me);
	},
	
	render: function (model) {
		var me = this,
			data = model.toJSON().data,
			comments = data.comments,
			len = comments.length;

		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.show();

			me.$el
				.html(
					me.templateCount({
						page: 'page'
					})
				)
				.append(
					me.templateBox({
						isLogin: me.isLogin
					})
				)
				.append(me.templateRefresh());

			me.appendTo(
				new rocket.subview.comment_subpage_list(
					$.extend({
						data: comments
					}, me.options), 
					me
				),
				me.$('.comment-list-wrapper')
			);
			if (len > 0) {
				me.renderCount();
			}
			if (!data.hasmore) {
				me.$('.ui-refresh-wrapper').hide();
				return;
			}
		}
	},

	renderCount: function () {
		var me = this,
			countModel;

		countModel = new rocket.model.comment(
			$.extend({ 
				t: 'getcommentcount' 
			}
			, me.options)
		);
		countModel.fetch({
			success: function () {
				var data = countModel.toJSON();

				if (data.errno === 0) {
					me.$('.page-comment-tooltip').html(data.data.count);
				}
			}
		});
	},

	onLoadMoreClick: function (e) {
		var me = this;

		me.navigate([
			'#comment',
			me.options.type,
			me.options.nid
		].join('/'));
	},

	onPostClick: function (e) {
		this.subec.trigger('postComment', $(e.currentTarget));
	},

	onLoginClick: function () {
		this.subec.trigger('memberLogin');
	}
});

})(Zepto);