(function ($) {

rocket.subview.subscribe_tags = rocket.subview.extend({
	el: '#subscribe_view_tags',

	events: {
        'click .subscribe-tags-item': 'onItemClick',
        'click .subscribe-tags-btn': 'onBtnClick'
	},

    init: function (options) {
        var me = this;

        me.type = options.type;
    },

    registerEvents: function () {
        var me = this,
            ec = me.ec;

        ec.on('changeCurTag', me.onChangeCurTag, me);
        ec.on('pagebeforechange', me.onpagebeforechange, me);
    },

    unregisterEvents: function () {
        var me = this,
            ec = me.ec;

        ec.off('changeCurTag', me.onChangeCurTag, me);
    },

    onpagebeforechange: function (params) {
		var me = this,
			to = params.to;

		if (to == me.ec) {
			me.$el.show();
		}
	},

    onChangeCurTag: function (type) {
        var me = this;

        me.type = type;
        $.each(me.$('.subscribe-tags-item'), function (key, item) {
            var $item = $(this);
            if ($item.data('type') === type) {
                $item.addClass('subscribe-tags-cur');
            }
            else {
                $item.removeClass('subscribe-tags-cur');
            }
        });
        if (type === 'channel') {
            me.$('.subscribe-tags-btn').hide();
        }
        else {
            me.$('.subscribe-tags-btn').show();
        }
    },

    onItemClick: function (e) {
        var me = this,
            $el = $(e.currentTarget),
            type = $el.data('type');

        if (type !== me.type) {
            me.navigate('#subscribe/' + type);
        }
    },

    onBtnClick: function () {
        var me = this,
            model = rocket.model.subscribe.getInstance(me.type);

        model.fetch();
    }

});

})(Zepto);
