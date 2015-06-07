(function($){

var bdnews = window.bdnews = window.bdnews || {},
	conf = bdnews.conf 
		= bdnews.conf || {};

var tagDefault = [
    { name: '头条', type: 'focus' },
    { name: '本地', type: 'local' },
    { id: '478', name: '百家', type: 'news' },
    { name: '娱乐', type: 'info' },
    { name: '社会', type: 'info' },
    { name: '军事', type: 'info' },
    { name: '女人', type: 'info' },
    { name: '搞笑', type: 'info' },
    { name: '互联网', type: 'info' },
    { name: '科技', type: 'info' },
    { name: '生活', type: 'info' },
    { name: '国际', type: 'info' },
    { name: '国内', type: 'info' },
    { name: '体育', type: 'info' },
    { name: '汽车', type: 'info' },
    { name: '财经', type: 'info' },
    { name: '房产', type: 'info' },
    { name: '时尚', type: 'info' },
    { name: '教育', type: 'info' },
    { name: '游戏', type: 'info' },
    { name: '旅游', type: 'info' },
    { name: '人文', type: 'info' },
    { name: '创意', type: 'info' }
];

var videoTag = {
    info_hot: { name: '热点', type: 'info' },
    tvplay_hot: { name: '电视剧', type: 'tvplay' },
    movie_hot: { name: '电影', type: 'movie' },
    yule_hot: { name: '娱乐', type: 'yule' },
    live_hot: { name: '直播', type: 'live' },
    tvshow_hot: { name: '综艺', type: 'tvshow' },
    comic_hot: { name: '动漫', type: 'comic' },
    sport_hot: { name: '体育', type: 'sport' },
    micromovie_hot: { name: '微电影', type: 'micromovie' },
    music_hot: { name: '音乐', type: 'music' },
    child_comic_hot: { name: '动画片', type: 'child' },
    yuanchuang_hot: { name: '原创', type: 'yuanchuang' },
    education_hot: { name: '教育', type: 'education' },
    squaredance_hot: { name: '广场舞', type: 'squaredance' },
    game_hot: { name: '游戏', type: 'game' },
    amuse_hot: { name: '搞笑', type: 'amuse' }

};

var imgTag = [
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/mingxing.jpg',
        name: '明星',
        height: 205,
        width: 205
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/meinv.jpg',
        name: '美女',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/dongman.jpg',
        name: '动漫',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/bizhi.jpg',
        name: '壁纸',
        height: 100,
        width: 205
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/meishi.jpg',
        name: '美食',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/sheying.jpg',
        name: '摄影',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/yishu.jpg',
        name: '艺术',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/gaoxiao.jpg',
        name: '搞笑',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/guojiadili.jpg',
        name: '国家地理',
        height: 150,
        width: 310
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/xiaoqingxin.jpg',
        name: '小清新',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/qiche.jpg',
        name: '汽车',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/tiyu.jpg',
        name: '体育',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/lvyou.jpg',
        name: '旅游',
        height: 150,
        width: 310
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/fushi.jpg',
        name: '服饰',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/zhiwu.jpg',
        name: '植物',
        height: 100,
        width: 100
    },
    {
        imgUrl: '/static/bdnews/bdnews/page/img/img/pic/dongwu.jpg',
        name: '动物',
        height: 100,
        width: 100
    }
];

function getTagDefault () {
    return tagDefault;
}

function getTagLength () {
    return tagDefault.length;
}

function getVideoTag () {
    return videoTag;
}

function getImgTag () {
    return imgTag;
}

// weather

var weatherIcons = {
    'heavy_snow': /^暴雪|^大雪/
    , 'moderate_snow': /^中雪/ 
    , 'light_snow': /^小雪/
    , 'snow_shower': /^阵雪/

    , 'heavy_rain': /^暴雨|^大暴雨|^大雨|^特大暴雨/
    , 'moderate_rain': /^中雨/
    , 'shower': /^阵雨/
    , 'light_rain': /^小雨/
    , 'thunder_shower': /^雷阵雨/

    , 'sleet': /^雨夹雪|冻雨/

    , 'cloudy': /^多云/
    , 'overcast': /^阴$|^阴天/
    , 'sunny': /^晴$|^晴天/
    , 'fog': /^雾/
    , 'dust': /^扬尘|^浮尘/
    , 'sand_storm': /^沙尘暴|^强沙尘暴/
    , 'weather_default': /.*/
};

var iconRoot = '/static/bdnews/bdnews/page/index/img/weather-icons/';

function getWeatherIcon (info) {
    var icons = weatherIcons;

    for(var i in icons){
        if(icons[i].test(info)){
            return iconRoot + i + '.png';
        }
    }

    return iconRoot + 'weather_default' + '.png';
}

// share

var shareIcons = {
    qzone: {
        title: 'qq空间',
        url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'
    },
    sina: {
        title: '新浪微博',
        url: 'http://service.weibo.com/share/share.php'
    },
    renren: {
        title: '人人网',
        url: 'http://widget.renren.com/dialog/share'
    },
    qweibo: {
        title: '腾讯微博',
        url: 'http://share.v.t.qq.com/index.php'
    },
    weixin: {
        title: '微信好友',
        url: ''
    },
    qq: {
        title: 'qq好友',
        url: 'http://connect.qq.com/widget/shareqq/index.html?url=&title=&desc=&summary=&site=baidu'
    },
    pengyou: {
        title: '朋友网',
        url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url=&title=&desc=&summary='
    },
    douban: {
        title: '豆瓣',
        url: 'http://shuo.douban.com/!service/share'
    },
    baidu: {
        title: '百度贴吧',
        url: 'http://tieba.baidu.com/f/commit/share/openShareApi'
    }
};

function getShareIcons () {
    return shareIcons;
}

var newsTagKey = 'NEWS_TAGS';

function saveNewsTag (tags) {
    if (!tags) {
        tags = [];
    }
    window.bdnews.helper.storageSet(
        newsTagKey, JSON.stringify(tags)
    );
}

$.extend(conf, {
    getTagDefault: getTagDefault,
    getTagLength: getTagLength,
    getVideoTag: getVideoTag,
    getImgTag: getImgTag,
    getWeatherIcon: getWeatherIcon,
    getShareIcons: getShareIcons,
    saveNewsTag: saveNewsTag
});

})(Zepto);