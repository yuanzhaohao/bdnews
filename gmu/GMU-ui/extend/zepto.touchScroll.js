(function ($) {

function Scroll (options) {
	'use strict';

	var noop = function () {};
	var offloadFn = function (fn, s) { setTimeout(fn || noop, s || 0) };

	var defaults = {
			isCrosswise: true, // true表示横向，false表示纵向
			isMomentum: true,
			maxDist: 0,
			minDist: 0,
			onInit: function () { },
			onCheck: function () { }
		};

	var options = $.extend({}, defaults, options || {});
	var el = options.el[0],
		minDist = options.minDist,
		maxDist = options.maxDist,
		check = options.onCheck,
		isCrosswise = !!options.isCrosswise,
		isMomentum = !!options.isMomentum;

	var width = el.clientWidth,
		height = el.clientHeight,
		moveDist = 0,
		dist = 0,
		isMax = (dist >= maxDist),
		isMin = (dist <= minDist);

	function init () {
		options.onInit();
		el.addEventListener('touchstart', eventHandler, false);
		el.addEventListener('touchmove', eventHandler, false);
		el.addEventListener('touchend', eventHandler, false);
	}

	function move (dist, speed) {
		el.style.webkitTransitionDuration = speed + 'ms';
		if (isCrosswise) {
			el.style.webkitTransform = 'translate(' + dist + 'px,0px)';
		}
		else {
			el.style.webkitTransform = 'translate(0px, ' + dist + 'px)';
		}
	}

	function momentum (d, cur, start, time, min, max, size) {
		var distance = cur - start,
			speed = Math.abs(distance) / time,
			deceleration = 0.0006,
			direction = (distance < 0) 
				? -1 
				: 1,
			dest,
			duration;

		dest = d + cur + (speed * speed) / (2 * deceleration) * direction;
		duration = speed / deceleration;

		if (dest <= min) {
			dest = size
				? min - (size / 2.5 * (speed / 8)) 
				: min;
			distance = Math.abs(dest - cur);
			duration = distance / speed;
		}
		else if (dest >= max) {
			dest = size 
				? size / 2.5 * (speed / 8) 
				: max;
			distance = Math.abs(cur) + dest;
			duration = distance / speed;
		}
		
		return {
			destination: Math.round(dest),
			duration: duration
		};
	}

	var start = {},
		delta = {},
		isScrolling;

	var eventHandler = {
		handleEvent: function (e) {
			switch (e.type) {
				case 'touchstart': 
					this.start(e);
					break;
				case 'touchmove': 
					this.move(e);
					break;
				case 'touchend':
					offloadFn(this.end(e));
					break;
			}
		},

		start: function (e) {
			if (!e.touches.length) {
				return;
			}
			var touch = e.touches[0];

			isScrolling = undefined;
			start = {
				x: touch.clientX,
				y: touch.clientY,
				time: +new Date
			};
			moveDist = dist;
			touch = null;

			// el.addEventListener('touchmove', eventHandler, false);
			// el.addEventListener('touchend', eventHandler, false);
			e.stopPropagation();
		},

		move: function (e) {
			e.preventDefault();
			if (!e.touches.length || e.scale && e.scale !== 1) {
				return;
			}
			var touch = e.touches[0],
				s, m, isValid;

			delta = {
				x: touch.clientX - start.x,
				y: touch.clientY - start.y
			};

			if (isCrosswise) {
				m = delta.x;
				s = width;
				isValid = Math.abs(delta.x) < Math.abs(delta.y);
			}
			else {
				m = delta.y;
				s = height;
				isValid = Math.abs(delta.y) < Math.abs(delta.x);
			}

			if (typeof isScrolling === 'undefined') {
				isScrolling = !!(isScrolling || isValid);
			}

			if (!isScrolling) {
				isMax = moveDist >= maxDist && m > 0;
				isMin = moveDist <= minDist && m < 0;

				m = m / (
					(isMin || isMax)
						? Math.abs(m) / s * 5 + 1
						: 1
				);
				moveDist = dist + m;
				move(moveDist, 0);
				check(isMax, isMin);
			}
			touch = null;
		},

		end: function (e) {
			var m = (isCrosswise)
				? delta.x
				: delta.y;

			if (!e.changedTouches.length || !m) {
				return;
			}

			// el.removeEventListener('touchmove', eventHandler, false);
			// el.removeEventListener('touchend', eventHandler, false);

			if (!isScrolling) {
				e.preventDefault();
				var duration = Number(+new Date - start.time),
					isTrigger = duration <= 250 && Math.abs(m) >= 20,
					isLimit = isMax || isMin,
					speed;

				if (isTrigger && !isLimit && isMomentum) {
					var m = (isCrosswise)
						? momentum(
							dist, 
							e.changedTouches[0].clientX, 
							start.x, 
							duration, 
							minDist, 
							maxDist,
							width
						)
						: momentum(
							dist, 
							e.changedTouches[0].clientY, 
							start.y, 
							duration, 
							minDist,
							maxDist, 
							height
						);

					speed = Math.max(m.duration, duration);
					dist = m.destination;
				}
				else {
					dist = moveDist;
					speed = 200;
				}
				offloadFn(move(dist, speed));

				if (isLimit) {
					if (isMax) {
						dist = maxDist;
					}
					if (isMin) {
						dist = minDist;
					}
					offloadFn(move(dist, speed));
				}
				else if (isMomentum) {
					if (dist >= maxDist && !isMax) {
						dist = maxDist;
						setTimeout(function () {
							move(dist, 200);
							isMax = true;
							check(isMax, isMin);
						}, speed);
					}
					if (dist <= minDist && !isMin) {
						dist = minDist;
						setTimeout(function () {
							move(dist, 200);
							isMin = true;
							check(isMax, isMin);
						}, speed);
					}
				}
				delta = {};
				start = {};
			}
		}
	};

	return {
		init: function () {
			init();
			init = null;
			this.init = null;
		},

		getDist: function () {
			return dist;
		},

		setDist: function (d) {
			dist = d;
		}
	};
}

$.fn.touchScroll = function (options) {
	options.el = this;
	var s = Scroll(options);
	s.init();
	return s;
};

})(Zepto);