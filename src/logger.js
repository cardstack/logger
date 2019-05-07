const format = require('./format');
const levels = require('./levels').default;
const LOG = require('./levels').LOG;
const {
  assertAllowedLog,
  isExpecting
} = require('./expectations');

class Logger {
  constructor(name, level, config={}) {
    this.name = name;
    this.level = level;
    this.formatters = {};

    let {
      color,
      interactive,
      timestamps
    } = config;
    this.color = color;
    this.interactive = interactive;
    this.timestamps = timestamps;
    this._lastTimestamp = new Date();

  }

  _log(levelIndex, formatArgs) {
    // log.log always outputs, and has no other effect
    if (levelIndex === LOG) {
      console.error(this.formatMessage(formatArgs));
    // we're in tests, because someone has called one of the log.expect... methods.
    // Don't output the message, but do track that it was seen, and throw if it's
    // unexpected.
    } else if (isExpecting()) {
      assertAllowedLog(this, levelIndex, formatArgs);
    // the normal case. Output the message if the channel is configured to print
    // messages of that importance.
    } else if (levelIndex >= this._level) {
      console.error(this.formatMessage(formatArgs));
    }
    // otherwise, do no work and output nothing
  }

  // accepts string for easy translation from config
  set level(newLevel) {
    this._level = levels.indexOf(newLevel);
  }

  registerFormatter(letter, formatter) {
    if (this.formatters[letter]) {
      throw new Error(`A formatter for "${letter}" has already been registered`);
    }
    this.formatters[letter] = formatter;
  }

  formatMessage(formatArgs) {
    let now = new Date();
    let prev = this._lastTimestamp;
    this._lastTimestamp = now;

    let opts = {
      formatters: this.formatters,
      interactive: this.interactive
    };
    if (this.interactive) {
      opts.color = this.color;
    }

    if (this.timestamps) {
      // dates are diffs for interactive, timestamps for non-tty
      if (this.interactive) {
        opts.diff = now - prev;
      } else {
        opts.timestamp = now;
      }
    }

    return format.formatMessage(formatArgs, this.name, opts);
  }

  // log.log always outputs, for development stuff only
  log(...formatArgs) {
    this._log(LOG, formatArgs);
  }
};

// adds log.trace, log.debug, etc.
// we slice() so we don't add a "none" method
for (let i in levels.slice(0, -1)) {
  Logger.prototype[levels[i]] = function(...formatArgs) {
    this._log(i, formatArgs);
  }
}

module.exports = Logger;
