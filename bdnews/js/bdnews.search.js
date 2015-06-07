(function($){

var bdnews = window.bdnews = window.bdnews || {},
	search = bdnews.search 
		= bdnews.search || {};

var searchKey = 'NEWS_SEARCH_HISTORY',
	limit = 7,
	imgSearchKey = 'IMG_SEARCH_HISTORY',
	limit = 7;

function isSearchHistory () {
	return !!JSON.parse(window.bdnews.helper.storageGet(searchKey));
}

function getSearchHistory () {
	return JSON.parse(
		window.bdnews.helper.storageGet(searchKey)
	) || [];
}

function setSearchHistory (v) {
	var h = getSearchHistory(),
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
		searchKey, JSON.stringify(h)
	);
}

function clearSearchHistory () {
	window.bdnews.helper.storageRemove(searchKey);
}

function isImgSearchHistory () {
	return !!JSON.parse(window.bdnews.helper.storageGet(imgSearchKey));
}

function getImgSearchHistory () {
	return JSON.parse(
		window.bdnews.helper.storageGet(imgSearchKey)
	) || [];
}

function setImgSearchHistory (v) {
	var h = getSearchHistory(),
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
		imgSearchKey, JSON.stringify(h)
	);
}

function clearImgSearchHistory () {
	window.bdnews.helper.storageRemove(imgSearchKey);
}

$.extend(search, {
	isSearchHistory: isSearchHistory,
	getSearchHistory: getSearchHistory,
	setSearchHistory: setSearchHistory,
	clearSearchHistory: clearSearchHistory,
	isImgSearchHistory: isImgSearchHistory,
	getImgSearchHistory: getImgSearchHistory,
	setImgSearchHistory: setImgSearchHistory,
	clearImgSearchHistory: clearImgSearchHistory
});

})(Zepto);