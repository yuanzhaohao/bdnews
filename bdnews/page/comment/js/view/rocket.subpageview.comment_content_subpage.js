(function ($) {

rocket.subpageview.comment_content_subpage = rocket.subpageview.extend({
	className: 'comment-view-subpage',

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

		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;
		me.isFirstRender = true;
		me.isLoading = false;
		me.pn = 20;
		me.options = options;
		me.isLogin = window.bdnews.login.isLogin();
		me.model = new rocket.model.comment(
			$.extend({
				t: 'getcomments',
				pn: me.pn
			}, options)
		);
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
			me.$el
				.html(
					me.templateBox({
						isLogin: me.isLogin
					})
				)
				.append(
					me.templateCount({
						page: 'comment'
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
		}
		else {
			me.trigger('loadMoreComment', {
				data: comments
			});
		}
		if (len > 0) {
			me.startComment = comments[len - 1].id;
		}
		if (!data.hasmore) {
			me.$('.ui-refresh-wrapper').hide();
			return;
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
					me.$('.comment-count').html(data.data.count);
				}
			}
		});
	},

	onsubpagebeforechange: function (params) {
		var me = this, 
			from = params.from,
			to = params.to,
			param = params.params,
			featureString = me.getFeatureString(param);

		if (to == me.ec) {
			if (me.featureString == featureString) {
				if (me.isFirstLoad) {
					if (me.isLoading) {
						return;
					}
					me.isLoading = true;
					me.model.fetch({
						startComment: me.startComment,
						success: function () {
							me.isFirstLoad = false;
							me.isLoading = false;
						},
						error: function () {
							me.isLoading = false;
						}
					});
				}
				me.$el.show();
			}
		}
	},

	onLoadMoreClick: function (e) {
		var me = this,
			$el = $(e.currentTarget);

		if (!!me.isLoading) {
			return;
		}
		me.isLoading = true;
		var html = $el.html();

		$el.html('<span class="ui-refresh-pullup-icon"></span>加载中...')
			.addClass('ui-refresh-loading');

		me.model.fetch({
			startComment: me.startComment,
			success: function () {
				me.isLoading = false;
				$el.html(html)
					.removeClass('ui-refresh-loading');
			},
			error: function () {
				me.isLoading = false;
				$el.html(html)
					.removeClass('ui-refresh-loading');
			}
		});
	},

	onPostClick: function (e) {
		this.subec.trigger('postComment', $(e.currentTarget));
	},

	onLoginClick: function () {
		this.subec.trigger('memberLogin');
	}
});

})(Zepto);