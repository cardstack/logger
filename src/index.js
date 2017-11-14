const color = require('./color');
const Logger = require('./logger');


module.exports = function createLogger(name) {
  return new Logger(name, 'info', {
    interactive: true,
    color: color.choose(name),
    log: console.error
  });
}
