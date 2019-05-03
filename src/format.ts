const util = require('util');
const humanize = require('ms');

function ansiColor(text, color, {bold}={}) {
  if (color < 8) {
    color = '3' + color;
  } else {
    color = '38;5;' + color;
  }
  if (bold) {
    color = '1;'+color;
  }
  return `\u001b[${color}m${text}\u001b[0m`;
};

function prefixLines(prefix, text) {
  return text.split('\n').map(line => prefix + line).join('\n');
};

function runFormatters(args, formatters) {
  let result = args.slice();
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
};

function formatMessage(args, channel, options={}) {
  let {
    color,
    diff,
    formatters,
    interactive,
    timestamp
  } = options;

  formatters = formatters || {};

  // run custom formatters
  args = runFormatters(args, formatters);
  // run builtin formatters
  let text = util.format(...args);

  if (color) {
    channel = ansiColor(channel, color, {bold:true});
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
    if (color) {
      suffix = ansiColor(suffix, color);
    }
    suffix = ' ' + suffix
  }

  // when going to the terminal it's nice for indentation's
  // sake if all lines of the message get the channel name,
  // but that's not great for automated logs.

  if (interactive) {
    return prefixLines('  '+prefix, text) + suffix;
  } else {
    return prefix + text + suffix;
  }
};

module.exports = {
  color: ansiColor,
  prefixLines,
  runFormatters,
  formatMessage
};
