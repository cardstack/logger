import { formatMessage, Formatters, FormatOptions } from './format';

const levelsObj = {
  trace: true,
  debug: true,
  info: true,
  warn: true,
  error: true,
  none: true,
};

const levels = Object.keys(levelsObj);

export type Level = keyof typeof levelsObj;

import {
  assertAllowedLog,
  isExpecting
} from './expectations';

interface Options {
  color?: number;
  interactive?: boolean;
  timestamps?: boolean;
}

export default class Logger {
  private formatters: Formatters = {};
  private color: Options["color"];
  private interactive: Options["interactive"];
  private timestamps: Options["timestamps"];
  private _lastTimestamp: Date = new Date();
  private _level: number;

  constructor(public name: string, level: Level, config: Options={}) {
    let {
      color,
      interactive,
      timestamps
    } = config;
    this.color = color;
    this.interactive = interactive;
    this.timestamps = timestamps;
    this._level = levels.indexOf(level)
  }

  _log(level: Level, formatArgs: [string, any]) {
    if (assertAllowedLog(this, level, formatArgs)) {
      // we're in tests, because someone has called one of the log.expect...
      // methods. All the work is done inside assertAllowedLog.
    } else if (levels.indexOf(level) >= this._level) {
      // the normal case. Output the message if the channel is configured to print
      // messages of that importance.
      console.error(this.formatMessage(formatArgs));
    }
    // otherwise, do no work and output nothing
  }

  registerFormatter(letter: string, formatter: (value: any) => string) {
    if (this.formatters[letter]) {
      throw new Error(`A formatter for "${letter}" has already been registered`);
    }
    this.formatters[letter] = formatter;
  }

  set level(level: Level) {
    this._level = levels.indexOf(level);
  }

  formatMessage(formatArgs: [string, any]) {
    let now = new Date();
    let prev = this._lastTimestamp;
    this._lastTimestamp = now;

    let opts: FormatOptions = {
      formatters: this.formatters,
      interactive: this.interactive
    };
    if (this.interactive) {
      opts.color = this.color;
    }

    if (this.timestamps) {
      // dates are diffs for interactive, timestamps for non-tty
      if (this.interactive) {
        opts.diff = now.getTime() - prev.getTime();
      } else {
        opts.timestamp = now;
      }
    }

    return formatMessage(formatArgs, this.name, opts);
  }

  // log.log always outputs, for development stuff only
  log(...formatArgs: [string, any]) {
    console.error(this.formatMessage(formatArgs));
  }

  trace(...formatArgs: [string, any]) { this._log('trace', formatArgs); }
  debug(...formatArgs: [string, any]) { this._log('debug', formatArgs); }
  info(...formatArgs: [string, any]) { this._log('info', formatArgs); }
  warn(...formatArgs: [string, any]) { this._log('warn', formatArgs); }
  error(...formatArgs: [string, any]) { this._log('error', formatArgs); }
}
