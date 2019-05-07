const format = require('./format');
const levels = require('./levels').default;

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
    // we're in tests, because someone has called one of the log.expect... methods.
    // Don't output the message, but do track that it was seen, and throw if it's
    // unexpected.
    if (isExpecting()) {
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
    console.error(this.formatMessage(formatArgs));
  }

  trace(...formatArgs) { this._log(0, formatArgs); }
  debug(...formatArgs) { this._log(1, formatArgs); }
  info(...formatArgs) { this._log(2, formatArgs); }
  warn(...formatArgs) { this._log(3, formatArgs); }
  error(...formatArgs) { this._log(4, formatArgs); }
};

module.exports = Logger;
