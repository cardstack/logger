const tty = require('tty');
const assert = require('assert');

const color = require('./color');
const Logger = require('./logger');
const env = require('./environment');
const patterns = require('./patterns');
const levels = require('./levels');
const {
  addExpectMethods,
  assertAllowedLog,
  isExpecting
} = require('./expectations');


function createLogger(name) {
  let level = patterns.findMatch(createLogger.config.logLevels, name, createLogger.config.defaultLevel);
  let log = new Logger(name, level, {
    color: color.choose(name),
    interactive: createLogger.config.interactive,
    log: doLog
  });
  createLogger.instances.push(log);
  return log;
}

createLogger.config = {
  defaultLevel: 'info',
  interactive: tty.isatty(process.stderr),
  logLevels: [],
  timestamps: process.env.LOG_TIMESTAMPS !== 'false'
};
createLogger.instances = [];

function doLog(instance, levelIndex, formatArgs) {
  // log.log always outputs, and has no other effect
  if (levelIndex === levels.LOG) {
    console.error(instance.formatMessage(formatArgs));
  // we're in tests, because someone has called one of the log.expect... methods.
  // Don't output the message, but do track that it was seen, and throw if it's
  // unexpected.
  } else if (isExpecting(createLogger)) {
    assertAllowedLog(createLogger, ...arguments);
  // the normal case. Output the message if the channel is configured to print
  // messages of that importance.
  } else if (levelIndex >= instance._level) {
    console.error(instance.formatMessage(formatArgs));
  }
  // otherwise, do no work and output nothing
}

createLogger.configure = function(appConfig={}) {
  let overrides = env.parseEnv(process.env);

  createLogger.config.defaultLevel = overrides.defaultLevel || appConfig.defaultLevel || 'info';

  let logLevels = (appConfig.logLevels || []).concat(overrides.logLevels);
  createLogger.config.logLevels = logLevels.map(([pattern, level]) => [patterns.compile(pattern), level]);

  createLogger.instances.forEach(function(log) {
    log.level = patterns.findMatch(createLogger.config.logLevels, log.name, createLogger.config.defaultLevel);
  });
}


addExpectMethods(createLogger);
createLogger.configure() // pull in the environment config, in case app doesn't configure
module.exports = createLogger;
