// Generated by CoffeeScript 1.3.3
(function() {
  var CoffeeMation, add, animations, buildTransition, defer, delay, extend, frameId, merge, remove, runLoop, start, stop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  merge = function(options, overrides) {
    return extend(extend({}, options), overrides);
  };

  delay = function(ms, fn) {
    return setTimeout(fn, ms);
  };

  defer = function(fn) {
    return delay(10, fn);
  };

  (function() {
    var lastTime, vendor, vendors, _i, _len;
    lastTime = 0;
    vendors = ['ms', 'moz', 'webkit', 'o'];
    this.cancelAnimationFrame || (this.cancelAnimationFrame = this.cancelRequestAnimationFrame);
    if (!this.requestAnimationFrame) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        vendor = vendors[_i];
        this.requestAnimationFrame || (this.requestAnimationFrame = this[vendor + 'RequestAnimationFrame']);
        this.cancelAnimationFrame = this.cancelRequestAnimationFrame || (this.cancelRequestAnimationFrame = this[vendor + 'CancelRequestAnimationFrame']);
      }
    }
    if (!this.requestAnimationFrame) {
      this.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = this.setTimeout((function() {
          return callback(currTime + timeToCall);
        }), timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!this.cancelAnimationFrame) {
      return this.cancelAnimationFrame = this.cancelRequestAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

  animations = [];

  frameId = null;

  buildTransition = function(easeOut, name) {
    var easeIn, transition;
    easeIn = function(p) {
      return 1 - easeOut(1 - p);
    };
    easeOut.Name = name + '.EaseOut';
    easeIn.Name = name + '.EaseIn';
    return transition = extend(easeOut, {
      EaseOut: easeOut,
      EaseIn: easeIn
    });
  };

  add = function(animation) {
    animations.push(animation);
    return start();
  };

  remove = function(animation) {
    var anim, i, _i, _len;
    for (i = _i = 0, _len = animations.length; _i < _len; i = ++_i) {
      anim = animations[i];
      if (anim === animation) {
        animations.splice(i, 1);
        break;
      }
    }
    if (animations.length === 0) {
      return stop();
    }
  };

  start = function() {
    if (!frameId) {
      return runLoop();
    }
  };

  stop = function() {
    cancelAnimationFrame(frameId);
    return frameId = null;
  };

  runLoop = function() {
    var animation, _i, _len, _results;
    frameId = requestAnimationFrame(runLoop);
    _results = [];
    for (_i = 0, _len = animations.length; _i < _len; _i++) {
      animation = animations[_i];
      _results.push(animation != null ? typeof animation._update === "function" ? animation._update(new Date().getTime()) : void 0 : void 0);
    }
    return _results;
  };

  CoffeeMation = {
    defaults: {
      duration: 1.0,
      delay: 0,
      fps: 100
    },
    Transitions: {
      _all: [],
      random: function() {
        var all, transition;
        all = CoffeeMation.Transitions._all;
        transition = all[Math.floor(Math.random() * all.length)];
        return transition;
      },
      add: function(transitions) {
        var name, transition, _results;
        _results = [];
        for (name in transitions) {
          if (!__hasProp.call(transitions, name)) continue;
          transition = transitions[name];
          _results.push((function(transition, name) {
            CoffeeMation.Transitions[name] = buildTransition(transition, name);
            return CoffeeMation.Transitions._all.push(CoffeeMation.Transitions[name]);
          })(transition, name));
        }
        return _results;
      }
    },
    animations: function() {
      return animations;
    },
    cancelAll: function() {
      var animation, _i, _len;
      for (_i = 0, _len = animations.length; _i < _len; _i++) {
        animation = animations[_i];
        if (animation != null) {
          if (typeof animation.cancel === "function") {
            animation.cancel();
          }
        }
      }
      animations = [];
      return stop();
    },
    finishAll: function() {
      var animation, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = animations.length; _i < _len; _i++) {
        animation = animations[_i];
        _results.push(animation != null ? typeof animation.finish === "function" ? animation.finish() : void 0 : void 0);
      }
      return _results;
    }
  };

  CoffeeMation.Transitions.add({
    Back: function(p) {
      var s;
      s = 1.70158;
      return (p -= 1) * p * ((s + 1) * p + s) + 1;
    },
    Bounce: function(p) {
      var a, d;
      a = 7.5625;
      d = 2.75;
      if (p < 1 / d) {
        return a * p * p;
      } else if (p < 2 / d) {
        return a * (p -= 1.5 / d) * p + 0.75;
      } else if (p < 2.5 / d) {
        return a * (p -= 2.25 / d) * p + 0.9375;
      } else {
        return a * (p -= 2.625 / d) * p + 0.984375;
      }
    },
    Elastic: function(p) {
      return 1 - Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6);
    },
    Exponential: function(p) {
      if (p === 1) {
        return p;
      } else {
        return 1 - Math.pow(2, -10 * p);
      }
    },
    Linear: function(p) {
      return p;
    },
    Sine: function(p) {
      return Math.sin(p * Math.PI / 2);
    }
  });

  CoffeeMation.defaults.transition = CoffeeMation.Transitions.Exponential;

  CoffeeMation.Base = (function() {

    function Base(options) {
      var _this = this;
      this.options = merge(CoffeeMation.defaults, options);
      this.starts = new Date().getTime();
      this.duration = this.options.duration * 1000;
      this.ends = this.starts + this.duration;
      this.currentFrame = 0;
      this.totalFrames = this.options.duration * this.options.fps;
      this.position = 0;
      defer(function() {
        return add(_this);
      });
    }

    Base.prototype._update = function(time) {
      var frame, pos, _base, _base1;
      if (time >= this.starts) {
        if (!this.onstartCalled) {
          if (typeof (_base = this.options).onStart === "function") {
            _base.onStart();
          }
        }
        if (time >= this.ends) {
          this._render(1);
          this.cancel();
          if (typeof (_base1 = this.options).onFinish === "function") {
            _base1.onFinish();
          }
          return;
        }
        pos = (time - this.starts) / this.duration;
        frame = Math.round(pos * this.totalFrames);
        if (frame > this.currentFrame) {
          this._render(pos);
          return this.currentFrame = frame;
        }
      }
    };

    Base.prototype._render = function(pos) {
      var _base, _base1, _base2, _base3;
      this.position = (typeof (_base = this.options).transition === "function" ? _base.transition(pos) : void 0) || 0;
      if (this.render != null) {
        if (typeof (_base1 = this.options).onBeforeUpdate === "function") {
          _base1.onBeforeUpdate();
        }
        this.render(this.position);
        if (typeof (_base2 = this.options).onAfterUpdate === "function") {
          _base2.onAfterUpdate();
        }
        return typeof (_base3 = this.options).onUpdate === "function" ? _base3.onUpdate() : void 0;
      } else {
        return typeof this.cancel === "function" ? this.cancel() : void 0;
      }
    };

    Base.prototype.render = function() {
      throw 'CoffeeMation.Base must be extended, and ::render() must be defined!';
    };

    Base.prototype.cancel = function() {
      var _base;
      if (typeof (_base = this.options).onStop === "function") {
        _base.onStop();
      }
      return remove(this);
    };

    Base.prototype.finish = function() {
      return typeof this._update === "function" ? this._update(this.ends) : void 0;
    };

    Base.prototype.finished = function() {
      return this.currentFrame >= this.totalFrames;
    };

    return Base;

  })();

  CoffeeMation.Transform = (function(_super) {
    var doRender;

    __extends(Transform, _super);

    doRender = function(obj, from, to, pos) {
      var attr, _results;
      _results = [];
      for (attr in to) {
        if (!__hasProp.call(to, attr)) continue;
        if (typeof to[attr] === 'object' && typeof from[attr] === 'object') {
          _results.push(doRender(obj[attr], from[attr], to[attr], pos));
        } else if (typeof to[attr] === 'number') {
          _results.push(obj[attr] = (to[attr] - from[attr]) * pos + from[attr]);
        } else {
          _results.push(obj[attr] = to[attr]);
        }
      }
      return _results;
    };

    function Transform(object, options) {
      Transform.__super__.constructor.call(this, options);
      this.object = object;
      this.options.from = this.options.from && merge(object, this.options.from) || extend({}, object);
      this.options.to = this.options.to || {};
    }

    Transform.prototype.render = function(pos) {
      return doRender(this.object, this.options.from, this.options.to, pos);
    };

    return Transform;

  })(CoffeeMation.Base);

  this.CoffeeMation = extend(CoffeeMation.Base, CoffeeMation);

}).call(this);
