(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.YScroll = factory();
  }
})(this, function() {

var win = window,
  doc = document,
  round = Math.round,
  abs = Math.abs;
var utils = (function (win, doc) {
  var self = this,
    div = doc.createElement('div'),
    prefix = ['webkit', 'moz', 'o', 'ms'],
    saveProp = {};

  var ucFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  };
  var some = function (ary, callback) {
    for (var i = 0, len = ary.length; i < len; i++) {
      if (callback(ary[i], i)) {
        return true;
      }
    }
    return false;
  };
  var getCSSVal = function (prop) {
    if (div.style[ prop ] !== undefined) {
      return prop;
    }
    else {
      var ret;
      some(prefix, function(_prefix) {
        var _prop = ucFirst(_prefix) + ucFirst(prop);
        if (div.style[ _prop ] !== undefined) {
          ret = '-' + _prefix + '-' + prop;
          return true;
        }
      });
      return ret;
    }
  };
  var setStyle = function (style, prop, val) {
    var _saveProp = saveProp[ prop ];
    if (_saveProp) {
      style[ _saveProp ] = val;
    }
    else if (style[ prop ] !== undefined) {
      saveProp[ prop ] = prop;
      style[ prop ] = val;
    }
    else {
      some(prefix, function(_prefix) {
        var _prop = ucFirst(_prefix) + ucFirst(prop);
        if (style[_prop] !== undefined) {
          saveProp[prop] = _prop;
          style[_prop] = val;
          return true;
        }
      });
    }
  };
  var hasProp = function (props) {
    return some(props, function(prop) {
      return div.style[prop] !== undefined;
    });
  };

  self.some = some;
  self.getCSSVal = getCSSVal;
  self.setStyle = setStyle;
  self.saveProp = saveProp;
  self.hasProp = hasProp;
  self.transform3d = hasProp([
    'perspectiveProperty',
    'WebkitPerspective',
    'MozPerspective',
    'OPerspective',
    'msPerspective'
  ]);
  self.transform = hasProp([
    'transformProperty',
    'WebkitTransform',
    'MozTransform',
    'OTransform',
    'msTransform'
  ]);
  self.transition = hasProp([
    'transitionProperty',
    'WebkitTransitionProperty',
    'MozTransitionProperty',
    'OTransitionProperty',
    'msTransitionProperty'
  ]);
  self.cssAnimation = (self.transform3d || self.transform) && self.transition;

  self.getTriangleSide = function (x1, y1, x2, y2) {
    var x = abs(x1 - x2);
    var y = abs(y1 - y2);
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return {
      x: x,
      y: y,
      z: z
    };
  };
  self.getAngle = function (triangle) {
    var cos = triangle.y / triangle.z;
    var radina = Math.acos(cos);

    return 180 / (Math.PI / radina);
  };
  self.momentum = function (current, start, time, lowerMargin, wrapperSize, direction) {
    var distance = current - start,
      speed = abs(distance) / time,
      deceleration = 0.0006,
      dist, duration;

    dist = current + (speed * speed) / (2 * deceleration) * direction;
    duration = speed / deceleration;
    if (dist < lowerMargin) {
      dist = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
      distance = abs(dist - current);
      duration = distance / speed;
    }
    else if (dist > 0) {
      dist = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
      distance = abs(current) + dist;
      duration = distance / speed;
    }

    return {
      dist: round(dist),
      duration: duration
    };
  };

  return self;
})(win, doc, undefined)


function YScroll(el, opts) {
  return this instanceof YScroll
    ? this.init.call(this, el, opts)
    : new YScroll(el, opts);
}

YScroll.prototype = {
  constructor: YScroll,

  ease: {
    quadratic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    circular: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
    back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    elastic: 'cubic-bezier(0, 0, 0.25, 1)'
  },

  DISTANCE_THRESHOLD: 5,
  ANGLE_THREHOLD: 55,

  init: function (el, opts) {
    var self = this;

    if (typeof el === 'string' && el !== '') {
      el = doc.querySelector(el);
    }

    if (!el) {
      throw new Error('element not found');
    }
    opts = opts || {};
    self.distance = opts.distance;
    self.bounceTime = opts.bounceTime || 350;
    self.isScroll = (opts.distance === undefined) ? true : false;
    self.curDist = 0;
    self.gestureStart = false;
    self.events = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel',
      transitionend: (utils.hasProp(['transition'])) ? 'transitionend' : 'webkitTransitionEnd'
    };
    self.cssAnimation = (opts.cssAnimation === undefined) ? utils.cssAnimation : opts.cssAnimation;

    if (self.isScroll) {
      self.scroller = el.children[0];
      self.wrapperWidth = el.clientWidth;
      self.maxDist = self.wrapperWidth - self.scroller.clientWidth;
      self.scroller.addEventListener(self.events.transitionend, self, false);
      self.bounceEasing = self.ease['quadratic'];
    }
    else {
      self.scroller = el;
      self.curPoint = 0;
      self.maxPoint = el.children.length - 1;
      self.maxDist = -self.distance * (self.maxPoint - 1);
      self.bounceEasing = self.ease['elastic'];
    }
    self.scrollerStyle = self.scroller.style;

    if (self.cssAnimation) {
      self._setStyle({
        transitionProperty: utils.getCSSVal('transform'),
        transitionTimingFunction: self.bounceEasing,
        transitionDuration: '0ms',
        transform: self._getTranslate(0, 0)
      });
    }
    else {
      self._setStyle({
        position: 'relative',
        left: '0px',
        top: '0px'
      });
    }
    self.scroller.addEventListener(self.events.start, self, false);
    return self;
  },

  handleEvent: function (e) {
    var self = this,
      events = self.events;

    switch (e.type) {
      case events.start: self._start(e); break;
      case events.move: self._move(e); break;
      case events.end: self._end(e); break;
      case events.cancel: self._end(e); break;
      case events.transitionend: self._transitionEnd(e); break;
      case 'click': self._click(e); break;
    }
  },

  _start: function (e) {
    var self = this;

    if (self.scrolling) {
      return;
    }

    self.scroller.addEventListener(self.events.move, self, false);
    doc.addEventListener(self.events.end, self, false);

    if (self.cssAnimation) {
      self._setStyle({ transitionDuration: '0ms' });
    }
    var touch = e.changedTouches ? e.changedTouches[0] : e;
    self.startPageX = touch.pageX;
    self.startPageY = touch.pageY;
    self.basePageX = self.startPageX;
    self.basePageY = self.startPageY;
    self.direction = 0;
    self.scrolling = true;
    self.moveReady = false;
    self.startTime = e.timeStamp;
    self.endTime = 0;
    self._triggerEvent('sTouchstart', true, false);
  },

  _move: function (e) {
    var self = this;

    if (!self.scrolling) {
      return;
    }

    var touch = e.changedTouches ? e.changedTouches[0] : e,
      pageX = touch.pageX,
      pageY = touch.pageY;

    if (self.moveReady) {
      e.preventDefault();
      var delta = pageX - self.basePageX,
        newDist = self.curDist + delta;
      if (newDist >= 0 || newDist < self.maxDist) {
        newDist = round(self.curDist + delta / 3);
      }

      // self.direction =
      //   delta === 0 ? self.direction :
      //   delta > 0 ? 1 : -1;

      var direction = (delta > 0) ? 1 : -1;
      var isPrevent = !self._triggerEvent('sTouchmove', true, true, {
        delta: delta,
        direction: direction
      });
      self.direction = direction;
      if (isPrevent) {
        self._touchAfter({
          moved: false,
          cancelled: true
        });
      }
      else {
        var args = [newDist, 0];
        self._setDist.apply(self, args);
      }
    }
    else {
      var triangle = utils.getTriangleSide(self.startPageX, self.startPageY, pageX, pageY);

      if (triangle.z > self.DISTANCE_THRESHOLD) {
        if (utils.getAngle(triangle) > self.ANGLE_THREHOLD) {
          e.preventDefault();
          self.moveReady = true;
          self.scroller.addEventListener('click', self, true);
        }
        else {
          self.scrolling = false;
        }
      }
    }
    self.basePageX = pageX;
    self.basePageY = pageY;
  },

  _end: function (e) {
    var self = this;

    self.scroller.removeEventListener(self.events.move, self, false);
    doc.removeEventListener(self.events.end, self, false);

    if (!self.scrolling) {
      return;
    }

    if (self.isScroll) {
      if (!self.resetDist()) {
        var timeStamp = e.timeStamp,
          duration = timeStamp - self.startTime,
          time = 0,
          newX = self.basePageX,
          distanceX = abs(newX - self.startPageX);

        if (duration < 300 && distanceX > 30) {
          var m = utils.momentum(self.basePageX, self.startPageX, duration, self.maxDist, self.wrapperWidth, self.direction);
          newX = m.dist;
          time = m.duration;
          self.isInTransition = 1;
          if (!self.cssAnimation) {
            if (newX >= 0) {
              newX = 0;
            }
            else if (newX < self.maxDist) {
              newX = self.maxDist;
            }
          }
        }

        if (self.basePageX != newX) {
          self._scrollTo(newX, 0, time);
          self.isInTransition = !!(time > 0);
        }
      }
    }
    else {
      var point = -self.curDist / self.distance;
      point =
        (self.direction < 0) ? Math.ceil(point) :
        (self.direction > 0) ? Math.floor(point) :
        Math.round(point);
      if (point < 0) {
        point = 0;
      }
      else if (point > self.maxPoint) {
        point = self.maxPoint;
      }
      self.moveToPoint(point);
    }
    self._touchAfter({
      moved: false,
      cancelled: false
    });
  },

  _transitionEnd: function (e) {
    var self = this;
    if (e.target != self.scroller || !self.isInTransition) {
      return;
    }
    if (self.resetDist()) {
      self.isInTransition = false;
    }
  },

  _click: function (e) {
    e.preventDefault();
    e.stopPropagation();
  },

  enable: function () {
    this.enabled = true;
  },

  disable: function () {
    this.enabled = false;
  },

  destroy: function () {
    var self = this;

    self.scroller.removeEventListener(self.events.start, self, false);
  },

  _triggerEvent: function (type, bubbles, cancelable, data) {
    var self = this,
      e = doc.createEvent('Event');

    e.initEvent(type, bubbles, cancelable);
    if (data) {
      for (var d in data) {
        if (data.hasOwnProperty(d)) {
          e[d] = data[d];
        }
      }
    }

    return self.scroller.dispatchEvent(e);
  },

  _touchAfter: function (param) {
    var self = this;

    self.scrolling = false;
    self.moveReady = false;
    self.startTime = 0;

    setTimeout(function() {
      self.scroller.removeEventListener('click', self, true);
    }, 200);

    self._triggerEvent('sTouchend', true, false, param);
  },

  _getTranslate: function (x, y) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  },

  _setStyle: function (styles) {
    var self = this,
      style = self.scrollerStyle;

    for (var prop in styles) {
      utils.setStyle(style, prop, styles[prop]);
    }
  },

  _setDist: function (x, y) {
    var self = this,
      style = self.scrollerStyle,
      dist = x;

    if (self.cssAnimation) {
      style[ utils.saveProp.transform ] = self._getTranslate(x, y);
    }
    else {
      style.left = dist + 'px';
    }
    self.curDist = dist;
  },

  _scrollTo: function (x, y, time) {
    var self = this;

    time = time || 0;
    if (self.cssAnimation) {
      self.scrollerStyle[utils.saveProp.transitionDuration] = time + 'ms';
      self._setDist(x, y);
    }
    else {
      self._animDist = self.curDist;
      self._animate(x, time || self.bounceTime);
      self.curDist = x;
    }
  },

  _animate: function (to, time) {
    var self = this,
      elem = self.scroller,
      elemStyle = self.scroller.style,
      begin = +new Date(),
      duration = parseInt(time, 10),
      dist = self._animDist;

    var easing = function(time, duration) {
      return -(time /= duration) * (time - 2);
    };
    var timer = setInterval(function() {
      var time = +new Date() - begin;
      var pos, now;

      if (time > duration) {
        clearInterval(timer);
        now = to;
      }
      else {
        pos = easing(time, duration);
        now = pos * (to - dist) + dist;
      }
      if (self.vertical) {
        elemStyle.top = now + 'px';
      }
      else {
        elemStyle.left = now + 'px';
      }
    }, 10);
  },

  resetDist: function () {
    var self = this,
      curDist = self.curDist;

    if (curDist > 0) {
      curDist = 0;
    }
    else if (curDist < self.maxDist) {
      curDist = self.maxDist;
    }

    if (curDist == self.curDist) {
      return false;
    }
    self._setDist(curDist, 0);
    return true;
  },

  moveToPoint: function (point, bounceTime, callback) {
    var self = this,
      curPoint = self.curPoint;

    point = (point === undefined) ? self.curPoint : parseInt(point, 10);
    bounceTime = (bounceTime === undefined) ? self.bounceTime : parseInt(bounceTime, 10);
    if (point < 0) {
      point = 0;
    }
    else if (point > self.maxPoint) {
      point = self.maxPoint;
    }
    self.curPoint = point;
    if (curPoint != self.curPoint) {
      self._triggerEvent('sPointmove', true, false, {
        prevPoint: curPoint,
        curPoint: self.curPoint
      });
    }
    self._scrollTo(-self.curPoint * self.distance, 0, bounceTime);
    callback && callback();
  }
};

return YScroll;
});
