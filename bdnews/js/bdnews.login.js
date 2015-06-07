(function($){

var bdnews = window.bdnews = window.bdnews || {},
	login = bdnews.login 
		= bdnews.login || {};

function getBDUSS () {
	return window.bdnews.helper.cookieGet('BDUSS');
}

function isLogin () {
	return !!getBDUSS();
}

function memberLogin () {
	var url = [
			'http://wappass.baidu.com/passport/?login',
			'u=' + encodeURIComponent(location.href),
			'tpl=xw',
			'uid=',
			'ssid=',
			'bd_page_type=1',
			'pu=',
			'tn='
		].join('&');

	location.href = url;
}

function memberLogout () {
	var url = [
			'http://wappass.baidu.com/passport/?logout',
			'u=' + encodeURIComponent(location.href),
			'tpl=xw',
			'uid=',
			'ssid=',
			'bd_page_type=1',
			'pu=',
			'tn='
		].join('&');

	location.href = url;
}

$.extend(login, {
	getBDUSS: getBDUSS,
	isLogin: isLogin,
	memberLogin: memberLogin,
	memberLogout: memberLogout
});

})(Zepto);