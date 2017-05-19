(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sizes = {
  '160x600': { dotRadius: 5.0, groupRadius: 22 },
  '300x250': { dotRadius: 6.0, groupRadius: 24 },
  '300x600': { dotRadius: 4.0, groupRadius: 22 },
  '320x50': { dotRadius: 7.5, groupRadius: 25 },
  '414x457': { dotRadius: 5.0, groupRadius: 22 },
  '600x90': { dotRadius: 7.5, groupRadius: 25 },
  '728x90': { dotRadius: 7.5, groupRadius: 25 },
  '960x150': { dotRadius: 7.5, groupRadius: 25 },
  '970x66': { dotRadius: 7.5, groupRadius: 25 },
  '1024x50': { dotRadius: 7.5, groupRadius: 25 }
};

var adSize = document.getElementById('default_hype_container').dataset.adSize,
    adId = document.body.dataset.adId,
    adType = adId.split('-')[0],
    adPillar = adId.split('-')[1].split('_')[0].toLowerCase();

if (adType == 'GH' && (adPillar == 'awareness1' || adPillar == 'awareness2')) {
  sizes[adSize].groupRadius *= .8;
}

function isIE() {
  var ua = window.navigator.userAgent;
  return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
}

function isEdge() {
  var ua = window.navigator.userAgent;
  return ua.indexOf('Edge/') > -1;
}

//////////////
///
/// LEDS CONTROLLER
///
//////////////

var LedGroup = function () {
  function LedGroup(el) {
    _classCallCheck(this, LedGroup);

    this.container = el;

    this.isSpinning = false;
    this.spinSteps;
    this.spinCount;
    this.lastSpinTime;
    this.activeLeds = [0, 3, 6, 9];
    this.ledCount = 12;
    this.leds = [];
    this.colors = ['#f48282', // red
    '#ffe999', // yellow
    '#6eda9f', // green
    '#7cb6f9' // blue
    ];

    setTimeout(function () {
      this.setupSVG();
      this.setupLeds();
    }.bind(this), 1);
  }

  _createClass(LedGroup, [{
    key: 'spin',
    value: function spin(start, spinCount) {
      start = start || false;
      spinCount = spinCount || 1;

      if (typeof start !== 'undefined' && !!start) {
        this.isSpinning = true;
        this.spinSteps = this.ledCount;

        if (typeof spinCount !== 'undefined') {
          this.spinCount = spinCount || 1;
        }
      }

      var timeDelta = Date.now() - this.lastSpinTime;

      if (this.lastSpinTime && timeDelta < 1000 / this.ledCount / 2) {
        requestAnimationFrame(this.spin.bind(this, false));

        return false;
      }

      this.updateLEDs();

      this.spinSteps--;

      if (this.spinSteps > 0) {
        requestAnimationFrame(this.spin.bind(this, false));
      } else {
        this.spinCount--;

        if (this.spinCount > 0) {
          requestAnimationFrame(this.spin.bind(this, true, false));
        }
      }

      this.lastSpinTime = Date.now();
    }
  }, {
    key: 'updateLEDs',
    value: function updateLEDs() {
      var _this = this;

      this.activeLeds.forEach(function (index, i) {
        if (index < _this.ledCount - 1) {
          _this.activeLeds[i]++;
        } else {
          _this.activeLeds[i] = 0;
        }
      });

      this.leds.forEach(function (led, i) {
        var activeIndex = _this.activeLeds.indexOf(i);

        if (activeIndex >= 0) {
          led.on(_this.colors[activeIndex]);
        } else {
          led.off();
        }
      });
    }
  }, {
    key: 'setupLeds',
    value: function setupLeds() {
      var angle = 0,
          width = 100,
          height = 100,
          radius = 1.2,
          steps = Math.PI * 2 / this.ledCount;

      for (var i = 0; i < this.ledCount; i++) {
        var cx = width / 2 + radius * Math.cos(angle) - width / 2,
            cy = width / 2 + radius * Math.sin(angle) - height / 2,
            opacity = this.activeLeds.indexOf(i) >= 0 ? 1 : 0,
            color = !!opacity ? this.colors[this.activeLeds.indexOf(i)] : 'rgba(255,255,255,1)';

        if (adType == 'GH' && (adPillar == 'awareness1' || adPillar == 'awareness2')) {
          cy += .25;
        }

        this.leds.push(new Led({
          parent: this.childContainer,
          index: i,
          x: cx,
          y: cy,
          angle: angle,
          radius: radius,
          opacity: this.activeLeds.indexOf(i) >= 0 ? 1 : 0,
          color: color
        }));

        angle += steps;
      }
    }
  }, {
    key: 'setupSVG',
    value: function setupSVG() {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }

      this.containerSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.containerSVG.setAttributeNS(null, 'version', '1.1');
      this.containerSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this.containerSVG.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      this.containerSVG.setAttributeNS(null, 'viewBox', '0 0 100 100');

      this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.el.setAttributeNS(null, 'viewBox', '0 14 99 99');
      this.el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this.el.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      this.el.setAttributeNS(null, 'width', "100%");
      this.el.setAttributeNS(null, 'height', "100%");
      this.el.setAttributeNS(null, 'preserveAspectRatio', "xMidYMid meet");

      if ((isIE() || isEdge()) && this.container.id == 'outro-lights' && adSize == '300x250' && (adPillar == 'dr1' || adPillar == 'dr2' || adPillar == 'dr3')) {
        this.el.setAttributeNS(null, 'viewBox', '-50 -40 100 100');
      }

      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('id', 'circle_group');

      var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'blur-effect');

      var gaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      gaussianBlur.setAttributeNS(null, 'stdDeviation', '0');

      filter.appendChild(gaussianBlur);
      this.el.appendChild(filter);
      this.el.appendChild(group);
      this.childContainer = this.el;

      this.containerSVG.appendChild(this.el);
      this.container.appendChild(this.containerSVG);
    }
  }]);

  return LedGroup;
}();

//////////////
///
/// LED OBJECT
///
//////////////

var Led = function () {
  function Led(opts) {
    _classCallCheck(this, Led);

    this.index = opts.index;
    this.active = false;
    this.x = opts.x;
    this.y = opts.y;
    this.angle = opts.angle;
    this.radius = sizes[adSize].dotRadius;
    this.parent = opts.parent;

    if (adType == 'GH' && (adPillar == 'awareness1' || adPillar == 'awareness2')) {
      this.radius *= .8;
    }

    this._createCircle();
    this.off();

    this.setOpacity(opts.opacity);
    this.el.style.fill = opts.color;

    return this;
  }

  _createClass(Led, [{
    key: '_createCircle',
    value: function _createCircle() {
      var _this2 = this;

      this.el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

      var groupRadius = sizes[adSize].groupRadius;

      if (isEdge() && ['160x600', '300x600'].indexOf(adSize) !== -1) {
        this.y += .5;
      }

      if (isIE() && ['160x600', '300x600'].indexOf(adSize) !== -1) {
        groupRadius *= 1.4;
        this.y += .5;
        this.radius *= 1.5;
      }

      this.el.setAttribute('r', this.radius);

      setTimeout(function () {
        _this2.el.setAttribute('cx', _this2.x * groupRadius + _this2.parent.width.baseVal.value / 2);
        _this2.el.setAttribute('cy', _this2.y * groupRadius + _this2.parent.height.baseVal.value / 2);
      }, 1);

      this.parent.appendChild(this.el);
    }
  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      this.el.style.opacity = opacity;
    }
  }, {
    key: 'on',
    value: function on(color) {
      this.active = true;

      this.el.style.fill = color;

      this.setOpacity(1);
    }
  }, {
    key: 'off',
    value: function off() {
      this.active = false;

      this.setOpacity(0);
    }
  }]);

  return Led;
}();

window.LedGroup = LedGroup;
window.Led = Led;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0ZW1wbGF0ZXMvc2hhcmVkL2pzL2xlZF9zcGlubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsSUFBSSxRQUFRO0FBQ1YsYUFBWSxFQUFFLFdBQVcsR0FBYixFQUFrQixhQUFhLEVBQS9CLEVBREY7QUFFVixhQUFZLEVBQUUsV0FBVyxHQUFiLEVBQWtCLGFBQWEsRUFBL0IsRUFGRjtBQUdWLGFBQVksRUFBRSxXQUFXLEdBQWIsRUFBa0IsYUFBYSxFQUEvQixFQUhGO0FBSVYsWUFBWSxFQUFFLFdBQVcsR0FBYixFQUFrQixhQUFhLEVBQS9CLEVBSkY7QUFLVixhQUFZLEVBQUUsV0FBVyxHQUFiLEVBQWtCLGFBQWEsRUFBL0IsRUFMRjtBQU1WLFlBQVksRUFBRSxXQUFXLEdBQWIsRUFBa0IsYUFBYSxFQUEvQixFQU5GO0FBT1YsWUFBWSxFQUFFLFdBQVcsR0FBYixFQUFrQixhQUFhLEVBQS9CLEVBUEY7QUFRVixhQUFZLEVBQUUsV0FBVyxHQUFiLEVBQWtCLGFBQWEsRUFBL0IsRUFSRjtBQVNWLFlBQVksRUFBRSxXQUFXLEdBQWIsRUFBa0IsYUFBYSxFQUEvQixFQVRGO0FBVVYsYUFBWSxFQUFFLFdBQVcsR0FBYixFQUFrQixhQUFhLEVBQS9CO0FBVkYsQ0FBWjs7QUFhQSxJQUFJLFNBQVMsU0FBUyxjQUFULENBQXdCLHdCQUF4QixFQUFrRCxPQUFsRCxDQUEwRCxNQUF2RTtBQUFBLElBQ0ksT0FBTyxTQUFTLElBQVQsQ0FBYyxPQUFkLENBQXNCLElBRGpDO0FBQUEsSUFFSSxTQUFTLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsQ0FBaEIsQ0FGYjtBQUFBLElBR0ksV0FBVyxLQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLENBQWhCLEVBQW1CLEtBQW5CLENBQXlCLEdBQXpCLEVBQThCLENBQTlCLEVBQWlDLFdBQWpDLEVBSGY7O0FBTUEsSUFBSSxV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YUFBSyxNQUFMLElBQWUsR0FBZjtBQUNEOztBQUVELFdBQUssRUFBTCxDQUFRLFlBQVIsQ0FBcUIsR0FBckIsRUFBMEIsS0FBSyxNQUEvQjs7QUFFQSxpQkFBVyxZQUFNO0FBQ2YsZUFBSyxFQUFMLENBQVEsWUFBUixDQUFxQixJQUFyQixFQUEyQixPQUFLLENBQUwsR0FBUyxXQUFULEdBQXdCLE9BQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsT0FBbEIsQ0FBMEIsS0FBMUIsR0FBa0MsQ0FBckY7QUFDQSxlQUFLLEVBQUwsQ0FBUSxZQUFSLENBQXFCLElBQXJCLEVBQTJCLE9BQUssQ0FBTCxHQUFTLFdBQVQsR0FBd0IsT0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixPQUFuQixDQUEyQixLQUEzQixHQUFtQyxDQUF0RjtBQUNELE9BSEQsRUFHRyxDQUhIOztBQUtBLFdBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsS0FBSyxFQUE3QjtBQUNEOzs7K0JBRVUsTyxFQUFTO0FBQ2xCLFdBQUssRUFBTCxDQUFRLEtBQVIsQ0FBYyxPQUFkLEdBQXdCLE9BQXhCO0FBQ0Q7Ozt1QkFFRSxLLEVBQU87QUFDUixXQUFLLE1BQUwsR0FBYyxJQUFkOztBQUVBLFdBQUssRUFBTCxDQUFRLEtBQVIsQ0FBYyxJQUFkLEdBQXFCLEtBQXJCOztBQUVBLFdBQUssVUFBTCxDQUFnQixDQUFoQjtBQUNEOzs7MEJBRUs7QUFDSixXQUFLLE1BQUwsR0FBYyxLQUFkOztBQUVBLFdBQUssVUFBTCxDQUFnQixDQUFoQjtBQUNEOzs7Ozs7QUFHSCxPQUFPLFFBQVAsR0FBa0IsUUFBbEI7QUFDQSxPQUFPLEdBQVAsR0FBYSxHQUFiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBzaXplcyA9IHtcbiAgJzE2MHg2MDAnOiAgeyBkb3RSYWRpdXM6IDUuMCwgZ3JvdXBSYWRpdXM6IDIyIH0sXG4gICczMDB4MjUwJzogIHsgZG90UmFkaXVzOiA2LjAsIGdyb3VwUmFkaXVzOiAyNCB9LFxuICAnMzAweDYwMCc6ICB7IGRvdFJhZGl1czogNC4wLCBncm91cFJhZGl1czogMjIgfSxcbiAgJzMyMHg1MCc6ICAgeyBkb3RSYWRpdXM6IDcuNSwgZ3JvdXBSYWRpdXM6IDI1IH0sXG4gICc0MTR4NDU3JzogIHsgZG90UmFkaXVzOiA1LjAsIGdyb3VwUmFkaXVzOiAyMiB9LFxuICAnNjAweDkwJzogICB7IGRvdFJhZGl1czogNy41LCBncm91cFJhZGl1czogMjUgfSxcbiAgJzcyOHg5MCc6ICAgeyBkb3RSYWRpdXM6IDcuNSwgZ3JvdXBSYWRpdXM6IDI1IH0sXG4gICc5NjB4MTUwJzogIHsgZG90UmFkaXVzOiA3LjUsIGdyb3VwUmFkaXVzOiAyNSB9LFxuICAnOTcweDY2JzogICB7IGRvdFJhZGl1czogNy41LCBncm91cFJhZGl1czogMjUgfSxcbiAgJzEwMjR4NTAnOiAgeyBkb3RSYWRpdXM6IDcuNSwgZ3JvdXBSYWRpdXM6IDI1IH1cbn07XG5cbnZhciBhZFNpemUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdF9oeXBlX2NvbnRhaW5lcicpLmRhdGFzZXQuYWRTaXplLFxuICAgIGFkSWQgPSBkb2N1bWVudC5ib2R5LmRhdGFzZXQuYWRJZCxcbiAgICBhZFR5cGUgPSBhZElkLnNwbGl0KCctJylbMF0sXG4gICAgYWRQaWxsYXIgPSBhZElkLnNwbGl0KCctJylbMV0uc3BsaXQoJ18nKVswXS50b0xvd2VyQ2FzZSgpO1xuXG5cbmlmIChhZFR5cGUgPT0gJ0dIJyAmJiAoYWRQaWxsYXIgPT0gJ2F3YXJlbmVzczEnIHx8IGFkUGlsbGFyID09ICdhd2FyZW5lc3MyJykpIHtcbiAgc2l6ZXNbYWRTaXplXS5ncm91cFJhZGl1cyAqPSAuODtcbn1cblxuZnVuY3Rpb24gaXNJRSgpIHtcbiAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHJldHVybiB1YS5pbmRleE9mKCdNU0lFICcpID4gLTEgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSA+IC0xO1xufVxuXG5mdW5jdGlvbiBpc0VkZ2UoKSB7XG4gIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4gdWEuaW5kZXhPZignRWRnZS8nKSA+IC0xO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vXG4vLy9cbi8vLyBMRURTIENPTlRST0xMRVJcbi8vL1xuLy8vLy8vLy8vLy8vLy9cblxuY2xhc3MgTGVkR3JvdXAge1xuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gZWw7XG5cbiAgICB0aGlzLmlzU3Bpbm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLnNwaW5TdGVwcztcbiAgICB0aGlzLnNwaW5Db3VudDtcbiAgICB0aGlzLmxhc3RTcGluVGltZTtcbiAgICB0aGlzLmFjdGl2ZUxlZHMgPSBbMCwgMywgNiwgOV07XG4gICAgdGhpcy5sZWRDb3VudCA9IDEyO1xuICAgIHRoaXMubGVkcyA9IFtdO1xuICAgIHRoaXMuY29sb3JzID0gW1xuICAgICAgJyNmNDgyODInLCAvLyByZWRcbiAgICAgICcjZmZlOTk5JywgLy8geWVsbG93XG4gICAgICAnIzZlZGE5ZicsIC8vIGdyZWVuXG4gICAgICAnIzdjYjZmOScgIC8vIGJsdWVcbiAgICBdO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldHVwU1ZHKCk7XG4gICAgICB0aGlzLnNldHVwTGVkcygpO1xuICAgIH0uYmluZCh0aGlzKSwgMSk7XG4gIH1cblxuICBzcGluKHN0YXJ0LCBzcGluQ291bnQpIHtcbiAgICBzdGFydCA9IHN0YXJ0IHx8IGZhbHNlO1xuICAgIHNwaW5Db3VudCA9IHNwaW5Db3VudCB8fCAxO1xuXG4gICAgaWYgKHR5cGVvZiBzdGFydCAhPT0gJ3VuZGVmaW5lZCcgJiYgISFzdGFydCkge1xuICAgICAgdGhpcy5pc1NwaW5uaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuc3BpblN0ZXBzID0gdGhpcy5sZWRDb3VudDtcblxuICAgICAgaWYgKHR5cGVvZiBzcGluQ291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuc3BpbkNvdW50ID0gc3BpbkNvdW50IHx8IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRpbWVEZWx0YSA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RTcGluVGltZTtcblxuICAgIGlmICh0aGlzLmxhc3RTcGluVGltZSAmJiB0aW1lRGVsdGEgPCAxMDAwIC8gdGhpcy5sZWRDb3VudCAvIDIpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnNwaW4uYmluZCh0aGlzLCBmYWxzZSkpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVMRURzKCk7XG5cbiAgICB0aGlzLnNwaW5TdGVwcy0tO1xuXG4gICAgaWYgKHRoaXMuc3BpblN0ZXBzID4gMCkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3Bpbi5iaW5kKHRoaXMsIGZhbHNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3BpbkNvdW50LS07XG5cbiAgICAgIGlmICh0aGlzLnNwaW5Db3VudCA+IDApIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3Bpbi5iaW5kKHRoaXMsIHRydWUsIGZhbHNlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0U3BpblRpbWUgPSBEYXRlLm5vdygpO1xuICB9XG5cbiAgdXBkYXRlTEVEcygpIHtcbiAgICB0aGlzLmFjdGl2ZUxlZHMuZm9yRWFjaCgoaW5kZXgsIGkpID0+IHtcbiAgICAgIGlmIChpbmRleCA8IHRoaXMubGVkQ291bnQgLSAxKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlTGVkc1tpXSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmVMZWRzW2ldID0gMDtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5sZWRzLmZvckVhY2goKGxlZCwgaSkgPT4ge1xuICAgICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5hY3RpdmVMZWRzLmluZGV4T2YoaSk7XG5cbiAgICAgIGlmIChhY3RpdmVJbmRleCA+PSAwKSB7XG4gICAgICAgIGxlZC5vbih0aGlzLmNvbG9yc1thY3RpdmVJbmRleF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVkLm9mZigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0dXBMZWRzKCkge1xuICAgIGxldCBhbmdsZSA9IDAsXG4gICAgICAgIHdpZHRoID0gMTAwLFxuICAgICAgICBoZWlnaHQgPSAxMDAsXG4gICAgICAgIHJhZGl1cyA9IDEuMixcbiAgICAgICAgc3RlcHMgPSBNYXRoLlBJICogMiAvIHRoaXMubGVkQ291bnQ7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVkQ291bnQ7IGkrKykge1xuICAgICAgdmFyIGN4ID0gKHdpZHRoIC8gMikgKyByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSkgLSAod2lkdGggLyAyKSxcbiAgICAgICAgICBjeSA9ICh3aWR0aCAvIDIpICsgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpIC0gKGhlaWdodCAvIDIpLFxuICAgICAgICAgIG9wYWNpdHkgPSB0aGlzLmFjdGl2ZUxlZHMuaW5kZXhPZihpKSA+PSAwID8gMSA6IDAsXG4gICAgICAgICAgY29sb3IgPSAhIW9wYWNpdHkgPyB0aGlzLmNvbG9yc1t0aGlzLmFjdGl2ZUxlZHMuaW5kZXhPZihpKV0gOiAncmdiYSgyNTUsMjU1LDI1NSwxKSc7XG5cblxuICAgICAgaWYgKGFkVHlwZSA9PSAnR0gnICYmIChhZFBpbGxhciA9PSAnYXdhcmVuZXNzMScgfHwgYWRQaWxsYXIgPT0gJ2F3YXJlbmVzczInKSkge1xuICAgICAgICBjeSArPSAuMjU7XG4gICAgICB9XG5cblxuICAgICAgdGhpcy5sZWRzLnB1c2goXG4gICAgICAgIG5ldyBMZWQoe1xuICAgICAgICAgIHBhcmVudDogdGhpcy5jaGlsZENvbnRhaW5lcixcbiAgICAgICAgICBpbmRleDogIGksXG4gICAgICAgICAgeDogICAgICBjeCxcbiAgICAgICAgICB5OiAgICAgIGN5LFxuICAgICAgICAgIGFuZ2xlOiAgYW5nbGUsXG4gICAgICAgICAgcmFkaXVzOiByYWRpdXMsXG4gICAgICAgICAgb3BhY2l0eTogdGhpcy5hY3RpdmVMZWRzLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwLFxuICAgICAgICAgIGNvbG9yOiBjb2xvclxuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgYW5nbGUgKz0gc3RlcHM7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBTVkcoKSB7XG4gICAgd2hpbGUgKHRoaXMuY29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluZXJTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHRoaXMuY29udGFpbmVyU1ZHLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2ZXJzaW9uJywgJzEuMScpO1xuICAgIHRoaXMuY29udGFpbmVyU1ZHLnNldEF0dHJpYnV0ZSgneG1sbnMnLCAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnKTtcbiAgICB0aGlzLmNvbnRhaW5lclNWRy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhsaW5rJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnKTtcbiAgICB0aGlzLmNvbnRhaW5lclNWRy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld0JveCcsICcwIDAgMTAwIDEwMCcpO1xuXG4gICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld0JveCcsICcwIDE0IDk5IDk5Jyk7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyk7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhsaW5rJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIFwiMTAwJVwiKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBcIjEwMCVcIik7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncHJlc2VydmVBc3BlY3RSYXRpbycsIFwieE1pZFlNaWQgbWVldFwiKTtcblxuICAgIGlmICgoaXNJRSgpIHx8IGlzRWRnZSgpKSAmJiB0aGlzLmNvbnRhaW5lci5pZCA9PSAnb3V0cm8tbGlnaHRzJyAmJiBhZFNpemUgPT0gJzMwMHgyNTAnICYmIChhZFBpbGxhciA9PSAnZHIxJyB8fCBhZFBpbGxhciA9PSAnZHIyJyAgfHwgYWRQaWxsYXIgPT0gJ2RyMycpKSB7XG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Qm94JywgJy01MCAtNDAgMTAwIDEwMCcpO1xuICAgIH1cblxuICAgIHZhciBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnZycpO1xuICAgIGdyb3VwLnNldEF0dHJpYnV0ZSgnaWQnLCAnY2lyY2xlX2dyb3VwJyk7XG5cbiAgICB2YXIgZmlsdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdmaWx0ZXInKTtcbiAgICBmaWx0ZXIuc2V0QXR0cmlidXRlKCdpZCcsICdibHVyLWVmZmVjdCcpO1xuXG4gICAgdmFyIGdhdXNzaWFuQmx1ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnZmVHYXVzc2lhbkJsdXInKTtcbiAgICBnYXVzc2lhbkJsdXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0ZERldmlhdGlvbicsICcwJyk7XG5cbiAgICBmaWx0ZXIuYXBwZW5kQ2hpbGQoZ2F1c3NpYW5CbHVyKTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKGZpbHRlcik7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgdGhpcy5jaGlsZENvbnRhaW5lciA9IHRoaXMuZWw7XG5cbiAgICB0aGlzLmNvbnRhaW5lclNWRy5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lclNWRyk7XG4gIH1cbn1cblxuXG5cblxuLy8vLy8vLy8vLy8vLy9cbi8vL1xuLy8vIExFRCBPQkpFQ1Rcbi8vL1xuLy8vLy8vLy8vLy8vLy9cblxuY2xhc3MgTGVkIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHRoaXMuaW5kZXggPSBvcHRzLmluZGV4O1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy54ID0gb3B0cy54O1xuICAgIHRoaXMueSA9IG9wdHMueTtcbiAgICB0aGlzLmFuZ2xlID0gb3B0cy5hbmdsZTtcbiAgICB0aGlzLnJhZGl1cyA9IHNpemVzW2FkU2l6ZV0uZG90UmFkaXVzO1xuICAgIHRoaXMucGFyZW50ID0gb3B0cy5wYXJlbnQ7XG5cbiAgICBpZiAoYWRUeXBlID09ICdHSCcgJiYgKGFkUGlsbGFyID09ICdhd2FyZW5lc3MxJyB8fCBhZFBpbGxhciA9PSAnYXdhcmVuZXNzMicpKSB7XG4gICAgICB0aGlzLnJhZGl1cyAqPSAuODtcbiAgICB9XG5cbiAgICB0aGlzLl9jcmVhdGVDaXJjbGUoKTtcbiAgICB0aGlzLm9mZigpO1xuXG4gICAgdGhpcy5zZXRPcGFjaXR5KG9wdHMub3BhY2l0eSk7XG4gICAgdGhpcy5lbC5zdHlsZS5maWxsID0gb3B0cy5jb2xvcjtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNpcmNsZSgpIHtcbiAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ2NpcmNsZScpO1xuXG4gICAgdmFyIGdyb3VwUmFkaXVzID0gc2l6ZXNbYWRTaXplXS5ncm91cFJhZGl1cztcblxuICAgIGlmIChpc0VkZ2UoKSAmJiBbJzE2MHg2MDAnLCAnMzAweDYwMCddLmluZGV4T2YoYWRTaXplKSAhPT0gLTEpIHtcbiAgICAgIHRoaXMueSArPSAuNTtcbiAgICB9XG5cbiAgICBpZiAoaXNJRSgpICYmIFsnMTYweDYwMCcsICczMDB4NjAwJ10uaW5kZXhPZihhZFNpemUpICE9PSAtMSkge1xuICAgICAgZ3JvdXBSYWRpdXMgKj0gMS40O1xuICAgICAgdGhpcy55ICs9IC41O1xuICAgICAgdGhpcy5yYWRpdXMgKj0gMS41O1xuICAgIH1cblxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdyJywgdGhpcy5yYWRpdXMpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY3gnLCB0aGlzLnggKiBncm91cFJhZGl1cyArICh0aGlzLnBhcmVudC53aWR0aC5iYXNlVmFsLnZhbHVlIC8gMikpO1xuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2N5JywgdGhpcy55ICogZ3JvdXBSYWRpdXMgKyAodGhpcy5wYXJlbnQuaGVpZ2h0LmJhc2VWYWwudmFsdWUgLyAyKSk7XG4gICAgfSwgMSk7XG5cbiAgICB0aGlzLnBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgfVxuXG4gIHNldE9wYWNpdHkob3BhY2l0eSkge1xuICAgIHRoaXMuZWwuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XG4gIH1cblxuICBvbihjb2xvcikge1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICAgIHRoaXMuZWwuc3R5bGUuZmlsbCA9IGNvbG9yO1xuXG4gICAgdGhpcy5zZXRPcGFjaXR5KDEpO1xuICB9XG5cbiAgb2ZmKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLnNldE9wYWNpdHkoMCk7XG4gIH1cbn1cblxud2luZG93LkxlZEdyb3VwID0gTGVkR3JvdXA7XG53aW5kb3cuTGVkID0gTGVkOyJdfQ==
