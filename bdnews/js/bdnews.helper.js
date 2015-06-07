(function($){

var bdnews = window.bdnews = window.bdnews || {},
	helper = bdnews.helper 
		= bdnews.helper || {};

function getFormatedDate (ms) {
    var d_minutes, d_hours, d_days;
    var timeNow = new Date().getTime();
    var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_secend = Math.round(d);
    if (d_days > 0 && d_days < 4) {
        return d_days + "天前";
    } 
    else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } 
    else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } 
    else if (d_minutes <= 0 && d_secend > 0) {
        return d_secend + "秒钟前";
    } 
    else if (d_secend == 0) {
        return "刚刚";
    } 
    else {
        var s = new Date();
            s.setTime(ms);
        return (s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " "+s.getHours() + ":"+s.getMinutes());
    }
}

function timeFormat (str, format) {
    var date = new Date(str),
        o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };

    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1, 
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    } 

    for (var k in o) {
        if(new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 
                ? o[k] 
                : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
}

//cookie methods from Tangram
function cookieIsValidKey(key) {
    // http://www.w3.org/Protocols/rfc2109/rfc2109
    // Syntax:  General
    // The two state management headers, Set-Cookie and Cookie, have common
    // syntactic properties involving attribute-value pairs.  The following
    // grammar uses the notation, and tokens DIGIT (decimal digits) and
    // token (informally, a sequence of non-special, non-white space
    // characters) from the HTTP/1.1 specification [RFC 2068] to describe
    // their syntax.
    // av-pairs   = av-pair *(";" av-pair)
    // av-pair    = attr ["=" value] ; optional value
    // attr       = token
    // value      = word
    // word       = token | quoted-string
    
    // http://www.ietf.org/rfc/rfc2068.txt
    // token      = 1*<any CHAR except CTLs or tspecials>
    // CHAR       = <any US-ASCII character (octets 0 - 127)>
    // CTL        = <any US-ASCII control character
    //              (octets 0 - 31) and DEL (127)>
    // tspecials  = "(" | ")" | "<" | ">" | "@"
    //              | "," | ";" | ":" | "\" | <">
    //              | "/" | "[" | "]" | "?" | "="
    //              | "{" | "}" | SP | HT
    // SP         = <US-ASCII SP, space (32)>
    // HT         = <US-ASCII HT, horizontal-tab (9)>
        
    return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
}

function cookieGetRaw(key) {
    if (cookieIsValidKey(key)) {
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie);
            
        if (result) {
            return result[2] || null;
        }
    }

    return null;
}

function cookieGet(key) {
    var value = cookieGetRaw(key);
    if ('string' == typeof value) {
        value = decodeURIComponent(value);
        return value;
    }
    return null;
}


function cookieSetRaw(key, value, options) {
    if (!cookieIsValidKey(key)) {
        return;
    }
    
    options = options || {};
    //options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
    //berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的
    
    // 计算cookie过期时间
    var expires = options.expires;
    if ('number' == typeof options.expires) {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires);
    }
    
    document.cookie =
        key + "=" + value
        + (options.path ? "; path=" + options.path : "")
        + (expires ? "; expires=" + expires.toGMTString() : "")
        + (options.domain ? "; domain=" + options.domain : "")
        + (options.secure ? "; secure" : ''); 
}

function cookieSet(key, value, options) {
    cookieSetRaw(key, encodeURIComponent(value), options);
}

function cookieRemove(key, options) {
    options = options || {};
    options.expires = new Date(0);
    cookieSetRaw(key, '', options);
}

//设置localstorage/cookie值
function storageSet(key, value, options){
    try {
        window.localStorage.setItem(key, value);
    }
    catch(e) {
        cookieSet(key, value, options);
    }
}

//获取localstorage/cookie值
// localstorage methods were copied from Baidu News
function storageGet(key){
    try {
        return window.localStorage.getItem(key);
    }
    catch(e) {
        return cookieGet(key);
    }
}

function storageRemove(key){
    try {
        window.localStorage.removeItem(key);
    }
    catch(e) {
        cookieRemove(key);
    }
}

function throttle (method, context, time, arr) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
        method.apply(context, arr);
    }, time);
}

$.extend(helper, {
    getFormatedDate: getFormatedDate,
    timeFormat: timeFormat,
    cookieIsValidKey: cookieIsValidKey,
    cookieGetRaw: cookieGetRaw,
    cookieGet: cookieGet,
    cookieSetRaw: cookieSetRaw,
    cookieSet: cookieSet,
    storageSet: storageSet,
    storageGet: storageGet,
    storageRemove: storageRemove,
    throttle: throttle
});

})(Zepto);