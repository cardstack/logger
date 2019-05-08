import { format } from 'util';
import humanize from 'ms';

export function color(text: string, colorVal: number, {bold}: { bold?: boolean } = {}) {
  let colorString: string;
  if (colorVal < 8) {
    colorString = '3' + colorVal;
  } else {
    colorString = '38;5;' + colorVal;
  }
  if (bold) {
    colorString = '1;'+colorString;
  }
  return `\u001b[${colorString}m${text}\u001b[0m`;
}

export function prefixLines(prefix: string, text: string) {
  return text.split('\n').map(line => prefix + line).join('\n');
}

export interface Formatters {
  [letter: string]: (value: any) => string;
}

export function runFormatters(args: FormatArgs, formatters: Formatters) {
  let result = args.slice() as FormatArgs;
  let str = result[0];
  let index = 0;
  result[0] = str.replace(/%([a-zA-Z])/g, function(match, letter) {
    index++;
    if (formatters[letter]) {
      result[index] = formatters[letter](result[index]);
      return '%s';
    } else {
      return match;
    }
  });
  return result;
}

export interface FormatOptions {
  color?: number;
  diff?: number;
  formatters?: Formatters;
  interactive?: boolean;
  timestamp?: Date;
}

export type FormatArgs = [string, any] | [string];

export function formatMessage(args: FormatArgs, channel: string, options: FormatOptions={}) {
  let {
    color: colorVal,
    diff,
    formatters,
    interactive,
    timestamp
  } = options;

  formatters = formatters || {};

  // run custom formatters
  args = runFormatters(args, formatters);
  // run builtin formatters
  let [pattern, ...rest] = args;
  let text = format(pattern, ...rest);

  if (colorVal) {
    channel = color(channel, colorVal, {bold:true});
  }

  // Always prefixed with the channel name.
  // If there's a timestamp, it goes first
  let prefix;
  if (timestamp != null) {
    let ts = timestamp.toISOString();
    prefix = `${ts} ${channel} `;
  } else {
    prefix = channel + ' ';
  }

  // +120ms or something goes at the end, same
  // color as the channel name
  let suffix = '';
  if (diff != null) {
    suffix = '+' + humanize(diff);
    if (colorVal) {
      suffix = color(suffix, colorVal);
    }
    suffix = ' ' + suffix;
  }

  // when going to the terminal it's nice for indentation's
  // sake if all lines of the message get the channel name,
  // but that's not great for automated logs.

  if (interactive) {
    return prefixLines('  '+prefix, text) + suffix;
  } else {
    return prefix + text + suffix;
  }
}

