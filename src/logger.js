const format = require('./format');
const levels = require('./levels').default;
const LOG = require('./levels').LOG;

class Logger {
  constructor(name, level, config={}) {
    this.name = name;
    this.level = level;
    this.formatters = {};

    let {
      color,
      interactive,
      log,
      timestamps
    } = config;
    this.color = color;
    this.interactive = interactive;
    this.timestamps = timestamps;
    this._lastTimestamp = new Date();
    // This will determine whether to actually output the message, and will
    // call our formatMessage() if necessary. We push the logic out there to
    // preserve performance while enabling the fancy expectWarn assertions.
    this._log = log;
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
    this._log(this, LOG, formatArgs);
  }
};

// adds log.trace, log.debug, etc.
// we slice() so we don't add a "none" method
for (let i in levels.slice(0, -1)) {
  Logger.prototype[levels[i]] = function(...formatArgs) {
    this._log(this, i, formatArgs);
  }
}

module.exports = Logger;
