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
