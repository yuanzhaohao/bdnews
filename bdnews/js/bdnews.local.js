(function ($) {

function local () {
	var _cityKey = 'NEWS_CITY_INFO',
		_overTime = 24 * 60 * 60 * 1000;

	function getCity () {
		return JSON.parse(
			window.bdnews.helper.storageGet(_cityKey)
		) || {};
	}

	function saveCity (id, name) {
		window.bdnews.helper.storageSet(
			_cityKey, 
			JSON.stringify({
				id: id,
				name: name,
				time: new Date().getTime()
			})
		);
	}
	
	function getOverTime () {
		return _overTime;
	}

	return {
		getCity: getCity,
		saveCity: saveCity,
		getOverTime: getOverTime
	}

}

window.bdnews.local = local();

})(Zepto);