(function($){

var bdnews = window.bdnews = window.bdnews || {},
	collect = bdnews.collect 
		= bdnews.collect || {};

var collectKey = 'NEWS_COLLECT_ARTICLE',
	limit = 20;

function isCollectArticle () {
	return !!JSON.parse(window.bdnews.helper.storageGet(collectKey));
}

function getCollectArticle () {
	return JSON.parse(
		window.bdnews.helper.storageGet(collectKey)
	) || [];
}

function removeCollectArticle (v) {
	var h = getCollectArticle(),
		i = h.length;
		
	while (i--) {
		if (v === h[i]) {
			h.splice(i, 1);
		}
	}
}

function setCollectArticle (v) {
	var h = getCollectArticle(),
		i = h.length,
		j;
		
	while (i--) {
		if (v === h[i]) {
			h.splice(i, 1);
		}
	}
	h.unshift(v);
	// 删除多余的项
	j = h.length;
	if (j > limit) {
		h.splice(j - 1, j - limit);
	}
	window.bdnews.helper.storageSet(
		collectKey, JSON.stringify(h)
	);
}

function clearCollectArticle () {
	window.bdnews.helper.storageRemove(collectKey);
}

$.extend(collect, {
	isCollectArticle: isCollectArticle,
	getCollectArticle: getCollectArticle,
	setCollectArticle: setCollectArticle,
	clearCollectArticle: clearCollectArticle,
	removeCollectArticle: removeCollectArticle
});

})(Zepto);