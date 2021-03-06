(function() {
	'use strict';

	var Swipe = {

		_maxTime: 2000,
		_minDistance: 30,

		_handleTouchStart: function(e) {

			var node = this;

			var tracking = {
				start: {
					time: new Date().getTime(),
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
				}
			};

			var reset = function() {
				tracking = null;
				node.removeEventListener('touchend', handleTouchEnd);
				node.removeEventListener('touchermove', handleTouchMove);
				node.removeEventListener('touchcancel', handleTouchCancel);
			};

			var handleTouchCancel = function() {
				reset();
				return;
			};

			var handleTouchEnd = function() {

				if (!tracking || !tracking.end) {
					return;
				}

				var elapsedTime = new Date().getTime() - tracking.start.time;
				if (elapsedTime > window.D2L.Gestures.Swipe._maxTime) {
					reset();
					return;
				}

				var distanceX = tracking.end.x - tracking.start.x;
				var distanceY = tracking.end.y - tracking.start.y;

				var theta = Math.atan(Math.abs(distanceX) / Math.abs(distanceY));
				if (distanceY > 0 && distanceX > 0) {
					theta = (Math.PI - theta) * 57.3;
				} else if (distanceY > 0 && distanceX < 0) {
					theta = (Math.PI + theta) * 57.3;
				} else if (distanceY < 0 && distanceX > 0) {
					theta = theta * 57.3;
				} else if (distanceY < 0 && distanceX < 0) {
					theta = ((2 * Math.PI) - theta) * 57.3;
				}

				var horizontal = 'none';
				if (Math.abs(distanceX) >= window.D2L.Gestures.Swipe._minDistance) {
					if (theta > 205 && theta < 335) {
						horizontal = 'left';
					} else if (theta > 25 && theta < 155) {
						horizontal = 'right';
					}
				}

				var vertical = 'none';
				if (Math.abs(distanceY) >= window.D2L.Gestures.Swipe._minDistance) {
					if (theta > 295 || theta < 65) {
						vertical = 'up';
					} else if (theta > 115 && theta < 245) {
						vertical = 'down';
					}
				}

				node.dispatchEvent(new CustomEvent('d2l-swipe', {
					detail: {
						distance: {
							x: distanceX,
							y: distanceY
						},
						direction: {
							angle: theta,
							horizontal: horizontal,
							vertical: vertical
						},
						duration: elapsedTime
					}
				}));

				reset();
			};

			var handleTouchMove = function(e) {
				if (!tracking) {
					return;
				}
				e.preventDefault();
				tracking.end = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
				};
			};

			node.addEventListener('touchend', handleTouchEnd);
			node.addEventListener('touchmove', handleTouchMove);
			node.addEventListener('touchcancel', handleTouchCancel);

		},

		register: function(node) {
			node.addEventListener('touchstart', this._handleTouchStart);
		},

		unregister: function(node) {
			node.removeEventListener('touchstart', this._handleTouchStart);
		}

	};

	window.D2L = window.D2L || {};
	window.D2L.Gestures = window.D2L.Gestures || {};
	window.D2L.Gestures.Swipe = Swipe;

})();
