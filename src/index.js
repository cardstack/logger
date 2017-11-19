const color = require('./color');
const Logger = require('./logger');


function createLogger(name) {
  return new Logger(name, createLogger.defaultLevel, {
    interactive: true,
    color: color.choose(name),
    log: console.error
  });
}

createLogger.defaultLevel = 'info';
createLogger.logLevels = [];

createLogger.configure = function({defaultLevel, logLevels}) {
  let changed = false;
  if (defaultLevel != null) {
    createLogger.defaultLevel = defaultLevel;
    changed = true;
  }
  if (logLevels != null) {
    createLogger.logLevels = logLevels;
    changed = true;
  }

  if (changed) {
    // recalculate channel levels
  }
}

module.exports = createLogger;
