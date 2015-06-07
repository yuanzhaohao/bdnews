(function($){
    
rocket.model.subscribe = rocket.model.extend({

    initialize: function(options){
        var me = this,
            classInfo;

        rocket.model.subscribe._instances
            || (rocket.model.subscribe._instances = {});

        me.options = options;
        me.type = me.getType();

        rocket.model.subscribe._instances[me.type] = me;

        // 数据缓存，用于限量输出、重绘等后续操作
        me.dataCache = [];

    }

    ,getType: function(){
        var me = this,
            opt = me.options || {},
            type = opt.type;
        
        if(type){
            if(/channel|tag|media|author/.test(type)){
                return type;
            }
        }

        return 'tag';
    }

    ,getData: function(){
        var me = this,
            data = me.get(me.getType());

        return data || null;
    }

    ,getLastId: function(){
        var me = this,
            data = me.getData();

        if(data){
            return data[data.length - 1].id || 0;
        }
        
        return 0;
    }

    /**
     * 大分类(四个大分类)对应新闻分类：
     * tag:     tag, search
     * channel: focus, chosen, local, info
     * media:   news(subscribe), beauty, meizi
     * author:  author 
     *
     * 大分类对应的可订阅源请求方式
     * getrecommendlist
     */

    ,getRequestInfo: function(){
        var me = this;

        return {
            method: 'POST'
            , querystring: '?tn=bdapibaiyue&t=getrecommendlist&act=get'
            , data: {
                mid: '03c7a16f2e8028127e42c5f7ca9e210b'
                , type: me.getType() 
                , id: me.getLastId() || 0 
            }
        };
    }

    ,isCacheEmpty: function(){
        return this.dataCache.length == 0;
    }

    ,fetch: function(options){
        var me = this,
            info = me.getRequestInfo(),
            opt = $.extend({
                type: info.method 
                , url: '/news' + ( info.querystring || '' )
                , data: info.data 
            }, options);

        return Backbone.Model.prototype.fetch.call(me, opt);
    }

    /**
     * beauty和meizi媒体的数据是第三方接口获取，webapp暂不提供，先做过滤处理
     * 精选频道在webapp端不提供
     */
    ,filterData: function(data){
        var media = data.media,
            channel = data.channel;

        if(media && media.length){
            var i = media.length - 1;
            while( i >= 0 ){
                if(media[i].type == 'beauty'
                    || media[i].type == 'meizitu'){
                    media.splice(i, 1);
                }
                i--;
            }
        }

        if(channel && channel.length){
            var i = channel.length - 1;
            while( i >= 0 ){
                if(channel[i].type == 'chosen'){
                    channel.splice(i, 1);
                }
                i--;
            }
        }

    }

    ,parse: function(resp, xhr){
        var me = this, 
            data;

        if(!resp || resp.errno){
            // 请求不成功，手动触发change事件
            me.isDataLimit = true;
            me.trigger('change', me);
            return {};
        }

        data = resp.data || resp;

        me.filterData(data);

        return data;
    }

});

rocket.model.subscribe.getInstance = function(type){
    var instances = rocket.model.subscribe._instances;
    return instances && instances[type];
}; 


})(Zepto);

