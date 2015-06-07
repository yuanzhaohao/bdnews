(function ($) {

rocket.subview.comment_subpage_list = rocket.subview.extend({
	className: 'comment-list',

	events: {
		'click .comment-praise': 'onPraiseClick',
		'click .comment-reply-btn': 'onReplyClick',
		'click .comment-reset': 'onResetClick'
	},

	template: _.template($('#template_comment_list').text()),

	templateCount: _.template($('#template_comment_count').text()),

	templateReply: _.template($('#template_comment_reply').text()),

	init: function (options) {
		var me = this;

		me.data = options.data || [];
		me.isFirstRender = true;
		me.options = options;
		me.isLogin = window.bdnews.login.isLogin();
		me.bduss = window.bdnews.login.getBDUSS() || 'null';
		
		me.showLoading(me.$el);
		me.render();
	},

	render: function () {
		var me = this;

		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.show();
			
			me.$el.html(
				me.template({
					isLogin: me.isLogin,
					list: me.data
				})
			);
			me.hideLoading(me.$el);
		}
		else {
			me.$el.append(
				me.template({
					isLogin: me.isLogin,
					list: me.data
				})
			);
		}
		setTimeout(function () {
			me.$('.img-lazyload').scrollLazyload({
				threshold: 50,
				isThrottle: true
			});
		}, 200);
		me.data = null;
	},

	registerEvents: function () {
		var me = this,
			subec = me.subec;

		subec.on('loadMoreComment', me.onLoadMoreComment, me);
		subec.on('postComment', me.onPostComment, me);
		subec.on('memberLogin', me.onMemberLogin, me);
	},

	unregisterEvents: function () {
		var me = this,
			subec = me.subec;

		subec.off('loadMoreComment', me.onLoadMoreComment, me);
		subec.off('postComment', me.onPostComment, me);
		subec.off('memberLogin', me.onMemberLogin, me);
	},

	onLoadMoreComment: function (params) {
		var me = this;

		me.data = params.data || [];
		me.render();
	},

	onPostComment: function ($el) {
		var me = this,
			$text = $el.parents('.comment-post')
				.siblings('.comment-textarea'),
			v = $text.val(),
			comment,
			id = $el.data('id'),
			user = $el.data('user'),
			text = $el.data('text'),
			extraText = ' //@' + user + ':' + text;

		if (!me.isLogin) {
			rocket.tip.showTip('请登录后再评论吧...');
			return;
		}
		if (!v) {
			rocket.tip.showTip('说点什么吧...');
			return;
		}
		if (!!me.isSending) {
			return;
		}
		if (!!id && !!text && !!user) {
			v += extraText;
		}
		me.isSending = true;

		comment = new rocket.model.comment(
			$.extend({
				text: v,
				bduss: me.bduss,
				t: 'comment' 
			}
			, me.options)
		);

		comment.fetch({
			success: function (model) {
				var noticeTxt,
					errno = model.toJSON().errno;

				me.isSending = false;
				switch (errno) {
					case 0:
						noticeTxt = '发布成功';
						$text.val('');
						break;
					case 6:
					case 7:
						noticeTxt = '您没有用户名，不能发表评论~';
						break;
					case 8:
						noticeTxt = '您的账户被封禁啦...';
						break;
					case 9:
						noticeTxt = '您回复太频繁了，请稍后再回复！';
						break;
					default:
						noticeTxt = '回复失败，请重试';
						break;
				}
				rocket.tip.showTip(noticeTxt);
			},
			error: function () {
				me.isSending = false;
			}
		});
	},

	onMemberLogin: function () {
		window.bdnews.login.memberLogin();
	},

	onPraiseClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			id = $el.data('id'),
			commentObj,
			support;

		if (!id) {
			return;
		}
		commentObj = window.bdnews.comment.getCommentPraise();
		if (!!commentObj[id]) {
			return;
		}
		support = new rocket.model.comment(
			$.extend({
				comment_id: id,
				cuid: me.bduss,
				t: 'support'
			}
			, me.options)
		);
		support.fetch({
			success: function (model) {
				if (model.toJSON().errno == 0) {
					var $num = $el.find('.comment-num'),
						$one = $el.find('.comment-one'),
						n = parseInt($num.text(), 10);

					window.bdnews.comment.addCommentPraise(id);
					$el.removeClass('comment-praise')
						.addClass('comment-haspraise');

					n++;
					$num.text(n);
					$one.css({
						'opacity': '1',
						'-webkit-transform': 'translateY(-18px)',
						'-webkit-transition-duration': '350ms'
					});
					setTimeout(function () {
						$one.css({
							'opacity': '0',
							'-webkit-transform': 'translateY(0)',
							'-webkit-transition-duration': '0'
						});
						obj = null;
						$num = null;
						$one = null;
					}, 400);
				}
			}
		});
	},

	onReplyClick: function (e) {
		var me = this,
			$el = $(e.currentTarget),
			$box = $el.parents('.comment-item-box').next(),
			id = $el.data('id'),
			user = $el.data('user'),
			text = $el.data('text'),
			isValid = !!id && !!user && !!text,
			isInView = $box.children().length > 0;;

		if (isValid) {
			if (isInView) {
				$box.html('').hide();
			}
			else {
				me.$('.comment-reply').html('');
				$box.html(
					me.templateReply({
						id: id,
						user: user,
						text: text,
						isLogin: me.isLogin
					})
				).show();
				$box.find('.comment-textarea').focus();

				setTimeout(function () {
					window.scrollTo(0, $box.offset().top - 130);
				}, 100);
			}
		}
	},

	onResetClick: function (e) {
		$(e.currentTarget).parents('.comment-reply').html('').hide();
	}
});

})(Zepto);