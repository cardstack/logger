module.exports.color = function(text, color, {bold}={}) {
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

module.exports.prefixLines = function(prefix, text) {
  return text.split('\n').map(line => prefix + line).join('\n');
};

module.exports.runFormatters = function(args, formatters) {
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
