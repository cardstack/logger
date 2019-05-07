const tty = require('tty');
const assert = require('assert');

const color = require('./color');
const Logger = require('./logger');
const env = require('./environment');
const patterns = require('./patterns');

const {
  addExpectMethods,
  assertAllowedLog,
  isExpecting
} = require('./expectations');


function createLogger(name) {
  let level = patterns.findMatch(createLogger.config.logLevels, name, createLogger.config.defaultLevel);
  let log = new Logger(name, level, {
    color: color.choose(name),
    interactive: createLogger.config.interactive
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

// at the end, so as to be careful about a cyclical dependency.
createLogger.getAPIWrapper = require('./compatibility');
