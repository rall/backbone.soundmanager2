// Generated by CoffeeScript 1.4.0
(function() {
  var Backbone,
    __slice = [].slice;

  if (typeof require !== "undefined" && require !== null) {
    Backbone = require("backbone");
  } else {
    Backbone = window.Backbone;
  }

  Backbone.SoundManager2 = (function() {

    _.extend(SoundManager2.prototype, Backbone.Events);

    function SoundManager2(options) {
      if (options == null) {
        options = {};
      }
      this.options = options;
      if (this.options.bus != null) {
        this.on("all", function() {
          var args, event, _ref;
          event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return (_ref = this.options.bus).trigger.apply(_ref, ["player:" + event].concat(__slice.call(args)));
        });
      }
      this.on("all", function() {
        var args, event, _ref, _ref1;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (((_ref = this.playable) != null ? _ref.trigger : void 0) == null) {
          return;
        }
        return (_ref1 = this.playable).trigger.apply(_ref1, ["player:" + event].concat(__slice.call(args)));
      });
      this;

    }

    SoundManager2.prototype.release = function() {
      var _ref;
      if (this.sound) {
        this.fadeout();
      }
      this.sound = null;
      this.trigger("releasing");
      if (((_ref = this.playable) != null ? _ref.release : void 0) != null) {
        this.playable.release();
      }
      this.playable = null;
      this.trigger("released");
      return this;
    };

    SoundManager2.prototype.fadeout = function() {
      var fnc, s, vol,
        _this = this;
      s = this.sound;
      vol = this.volume * 100;
      fnc = function() {
        vol -= 2;
        s.setVolume(vol);
        if (vol > 0) {
          return _.delay(fnc, 10);
        } else {
          return s.destruct();
        }
      };
      fnc();
      return this;
    };

    SoundManager2.prototype.getState = function() {
      if (this.playable == null) {
        return;
      }
      if (this.sound == null) {
        return "loading";
      }
      if (this.sound.playState === 0) {
        return "stopped";
      }
      if (this.sound.paused) {
        return "paused";
      } else {
        return "playing";
      }
    };

    SoundManager2.prototype.hasSoundLoaded = function() {
      return this.sound != null;
    };

    SoundManager2.prototype.isAlreadyPlaying = function(playable) {
      return (this.playable != null) && this.playable.id === playable.id;
    };

    SoundManager2.prototype.isPlayable = function(playable) {
      return (playable.id != null) && (playable.getAudioURL != null);
    };

    SoundManager2.prototype.ok = function() {
      return soundManager.ok();
    };

    SoundManager2.prototype.load = function(playable) {
      var _this = this;
      if (playable === this.playable) {
        return;
      }
      if (!soundManager.ok()) {
        return this.trigger("error", "SoundManager2 isn't ready.");
      }
      if (!this.isPlayable(playable)) {
        return this.trigger("error", "Playable doesn't satisfy the contract.", playable);
      }
      this.release();
      this.playable = playable;
      if (this.playable.retain != null) {
        this.playable.retain();
      }
      this.trigger("loading");
      return playable.getAudioURL(function(url) {
        if (_this.playable !== playable) {
          return;
        }
        _this.sound = soundManager.createSound({
          autoPlay: false,
          id: playable.id,
          url: url,
          volume: Math.round(_this.volume * 100),
          onfinish: function() {
            return _this.trigger("finished", _this.sound);
          },
          onplay: function() {
            return _this.trigger("played", _this.sound);
          },
          onpause: function() {
            return _this.trigger("paused", _this.sound);
          },
          onresume: function() {
            return _this.trigger("resumed", _this.sound);
          },
          onstop: function() {
            return _this.trigger("stopped", _this.sound);
          },
          whileplaying: function() {
            return _this.trigger("playing", _this.sound);
          },
          whileloading: function() {
            return _this.trigger("bytesLoaded", _this.sound);
          }
        });
        _this.trigger("loaded", _this.sound);
        if (_this.options.autoPlay === true) {
          return _this.sound.play();
        }
      });
    };

    SoundManager2.prototype.volume = 1;

    SoundManager2.prototype.setVolume = function(volume) {
      if (this.sound == null) {
        return;
      }
      if (volume > 1 || volume < 0) {
        return;
      }
      this.volume = volume;
      this.sound.setVolume(Math.round(this.volume * 100));
      return this.sound;
    };

    SoundManager2.prototype.setPosition = function(position) {
      if (this.sound == null) {
        return;
      }
      if (this.sound.bytesLoaded / this.sound.bytesTotal < position) {
        return;
      }
      this.sound.setPosition(position * this.sound.durationEstimate);
      return this.sound;
    };

    SoundManager2.prototype.setRelativePosition = function(position) {
      if (this.sound == null) {
        return;
      }
      return this.sound.setPosition(this.sound.position + position);
    };

    SoundManager2.prototype.toggle = function(playable) {
      if (playable == null) {
        playable = this.playable;
      }
      if ((this.sound != null) && this.isAlreadyPlaying(playable)) {
        return this.sound.togglePause();
      } else if (playable != null) {
        this.stop();
        return this.load(playable);
      }
    };

    SoundManager2.prototype.stop = function() {
      if (this.sound == null) {
        return;
      }
      return this.sound.stop();
    };

    SoundManager2.prototype.pause = function() {
      var _this = this;
      if (!this.sound) {
        return;
      }
      return this.fadeout(function() {
        _this.sound.pause();
        return _this.sound.setVolume(100);
      });
    };

    return SoundManager2;

  })();

}).call(this);
