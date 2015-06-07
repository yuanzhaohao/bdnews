(function ($) {

rocket.subpageview.index_content_subpage = rocket.subpageview.extend({
	className: 'index-view-subpage',

	events: {
		'click .ui-refresh': 'onLoadMoreClick'
	},

	template: _.template($('#template_ui_news').text()),

	init: function (options) {
		var me = this;

		me.type = options.type;
		me.name = options.name;
		me.featureString = me.getFeatureString();
		me.isFirstLoad = true;
		me.isFirstRender = true;
		me.isLoading = false;
		me.showLoading(me.$el);
		me.pn = 20;

		if (options.type === 'local') {
			var city = window.bdnews.local.getCity();

			if (city.id && city.id != options.id) {
				me.id = city.id;
				me.name = encodeURIComponent(city.name);
			}
		}
		me.model = new rocket.model.news({
			type: me.type,
			name: me.name,
			pn: me.pn,
			id: me.id
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
			newsList = model.getNews();
		
		if (me.isFirstRender) {
			me.isFirstRender = false;
			me.$el.html(me.template());
			me.prepend(
				new rocket.subview.ui_news_list(
					$.extend({
						data: newsList
					}, me.options)
					, me
				)
			);
			if (model.getFocus().length > 0) {
				me.prepend(
					new rocket.subview.index_subpage_carousel(
						$.extend({
							data: model.getFocus()
						}, me.options)
						, me
					)
				);
			}
			if (me.type === 'local') {
				me.prepend(
					new rocket.subview.index_subpage_weather({
						city: decodeURIComponent(me.name)
					}, me)
				);
				
				// 获取当前城市
				setTimeout(function () {
					me.getPosition();
				}, 150);
			}
			me.hideLoading(me.$el);
		}
		else {
			me.trigger('loadMoreDataReady', {
				data: newsList
			})
		}
		if (newsList.length < me.pn) {
			me.$('.ui-refresh-wrapper').hide();
			return;
		}
		newsList = null;
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

	getPosition: function () {
		var me = this,
			city = window.bdnews.local.getCity(),
			overTime = window.bdnews.local.getOverTime();

		if (!city.time || (
				city.time 
				&& (city.time + overTime) < new Date().getTime()
			)
		) {
			// if (navigator.geolocation) {
			// 	navigator.geolocation.getCurrentPosition(function (pos) {
			// 		console.log(pos)
					$.ajax({
						url: 'http://api.map.baidu.com/geocoder/v2/'
							+ '?ak=q4jSkuVulpDgWirnpCoKdcUx'
							+ '&location='
								+ 29.59 + ',' 
								+ 106.54
							+ '&output=json'
							+ '&pois=0'
							+ '&callback=?',
						type: 'GET',
						dataType: 'jsonp',
						success: function (data) {
							if (data.result) {
								var p = data.result.addressComponent.province,
									c;
								
								if (p.slice(0, -1) !== decodeURIComponent(me.name)) {
									c = data.result.addressComponent.city;
									me.getLocalId({
										province: p,
										city: c
									});
								}
							}
						}
					});
			// 	}, function (err) {
			// 		console.log(err);
			// 	}, {
			// 		timeout: 5000,
			// 		maximumAge: 25000
			// 	});
			// }
		}
	},

	getLocalId: function (d) {
		var me = this,
			localModel = new rocket.model.local(d);

		localModel.fetch();
		localModel.once('change', me.localRender, me);
	},

	localRender: function (model, res) {
		var me = this,
			data = model.toJSON().data;

		me.id = data.localid;
		me.name = data.displayname;
		me.model = new rocket.model.news({
			type: 'local',
			id: data.localid,
			name: data.displayname,
			pn: me.pn
		});
		
		rocket.dialog.showDialog({
			content: {
				title: '是否切换',
				text: '目前检测到你所在的城市是：' + data.displayname
			},
			callback: {
				confirm: me.onDialogConfirm
			},
			context: me
		});
	},

	onDialogConfirm: function () {
		var me = this;

		me.isFirstRender = true;

		window.bdnews.local.saveCity(me.id, me.name);
		me.model.fetch();
		me.model.on('change', me.render, me);
	}
});

})(Zepto);