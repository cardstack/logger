const color = require('./color');
const Logger = require('./logger');
const env = require('./environment');
const patterns = require('./patterns');


function createLogger(name) {
  let level = patterns.findMatch(createLogger.config.logLevels, name, createLogger.config.defaultLevel);
  let log = new Logger(name, level, {
    interactive: true,
    color: color.choose(name),
    log: console.error
  });
  createLogger.instances.push(log);
  return log;
}

createLogger.config = {
  defaultLevel: 'info',
  logLevels: []
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
createLogger.allLevels = function() {
  console.log('getting levels');
  createLogger.instances.forEach(function(log) {
    console.log(log.name, log.level);
  });
}

createLogger.configure() // pull in the environment config, in case app doesn't configure

module.exports = createLogger;
