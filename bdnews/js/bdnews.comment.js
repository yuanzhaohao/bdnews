(function($){

var bdnews = window.bdnews = window.bdnews || {},
	comment = bdnews.comment 
		= bdnews.comment || {};

// 添加评论相关操作
var commentContentKey = 'NEWS_COMMENT_CONTENT',
    commentIdKey = 'NEWS_COMMENT_ID',
    commentContentOvertime = 30 * 60 * 1000,
    commentContent;

var commentPraiseKey = 'NEWS_COMMENT_PRAISE',
    commentPraiseOvertime = 24 * 60 * 60 * 1000,
    commentPraise;

function getCommentContent () {
    var commentData
        = bdnews.helper.storageGet(commentContentKey);

    if(commentData){
        commentContent = JSON.parse(
            bdnews.helper.storageGet(commentContentKey)
        );
    }

    if (!commentContent) {
        commentContent = $.extend({
            time: new Date().getTime()
        }, commentContent);
    }
    else if ((commentContent.time + commentContentOvertime) < new Date().getTime()) {
        commentContent = $.extend({
            time: new Date().getTime()
        }, {});
    }
    return commentContent;
}

function getCommentContentInfo (key) {
    getCommentContent();
    return commentContent[key];
}

function _saveCommentContent () {
    bdnews.helper.storageSet(
        commentContentKey, JSON.stringify(commentContent)
    );
}

function setCommentContent (key, val) {
    getCommentContent();
    commentContent[key] = val;
    _saveCommentContent();
}

function delCommentContentInfo (key) {
    getCommentContent();
    delete commentContent[key];
    _saveCommentContent();
}

function getCommentPraise () {
    var commentData
        = bdnews.helper.storageGet(commentPraiseKey);

    if(commentData){
        commentPraise = JSON.parse(
            bdnews.helper.storageGet(commentPraiseKey)
        );
    }

    if (!commentPraise) {
        commentPraise = $.extend({
            time: new Date().getTime()
        }, commentPraise);
    }
    else if ((commentPraise.time + commentPraiseOvertime) < new Date().getTime()) {
        commentPraise = $.extend({
            time: new Date().getTime()
        }, {});
    }
    return commentPraise;
}

function _saveCommentPraise () {
    bdnews.helper.storageSet(
        commentPraiseKey, JSON.stringify(commentPraise)
    );
}

function addCommentPraise (key) {
    getCommentPraise();
    commentPraise[key] = true;
    _saveCommentPraise();
}

$.extend(comment, {
	getCommentContent: getCommentContent
	,getCommentContentInfo: getCommentContentInfo
	,setCommentContent:setCommentContent
	,delCommentContentInfo: delCommentContentInfo

	,getCommentPraise: getCommentPraise
	,addCommentPraise: addCommentPraise
});

})(Zepto);