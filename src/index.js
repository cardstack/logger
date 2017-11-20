const tty = require('tty');

const color = require('./color');
const Logger = require('./logger');
const env = require('./environment');
const patterns = require('./patterns');
const levels = require('./levels');


function createLogger(name) {
  let level = patterns.findMatch(createLogger.config.logLevels, name, createLogger.config.defaultLevel);
  let log = new Logger(name, level, {
    color: color.choose(name),
    formatters: createLogger.config.formatters,
    interactive: createLogger.config.interactive,
    log: doLog
  });
  createLogger.instances.push(log);
  return log;
}

function doLog(instance, level, formatArgs) {
  if (level === levels.LOG) {
    console.error(instance.formatMessage(formatArgs));
  } else if (level >= instance._level) {
    console.error(instance.formatMessage(formatArgs));
  }
}

createLogger.config = {
  defaultLevel: 'info',
  formatters: {},
  interactive: tty.isatty(process.stderr),
  logLevels: [],
  timestamps: process.env.LOG_TIMESTAMPS !== 'false'
};
createLogger.instances = [];

createLogger.configure = function(appConfig={}) {
  let overrides = env.parseEnv(process.env);

  createLogger.config.defaultLevel = overrides.defaultLevel || appConfig.defaultLevel || 'info';

  let logLevels = (appConfig.logLevels || []).concat(overrides.logLevels);
  createLogger.config.logLevels = logLevels.map(([pattern, level]) => [patterns.compile(pattern), level]);

  createLogger.instances.forEach(function(log) {
    log.level = patterns.findMatch(createLogger.config.logLevels, log.name, createLogger.config.defaultLevel);
  });
}

createLogger.registerFormatter = function(letter, formatter) {
  let existing = createLogger.config.formatters[letter];
  // Error when re-registering the same letter, but try to allow for
  // re-registration with the exact same function
  if (existing && existing.toString() !== formatter.toString()) {
    throw new Error(`A formatter for "${letter}" has already been registered`);
  }
  createLogger.config.formatters[letter] = formatter;
}

createLogger.configure() // pull in the environment config, in case app doesn't configure

module.exports = createLogger;
