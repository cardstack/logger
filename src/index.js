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

function doLog(instance, levelIndex, formatArgs) {
  if (levelIndex === levels.LOG) {
    console.error(instance.formatMessage(formatArgs));
  } else if (createLogger.expectation) {
    assertAllowedLog(...arguments);
  } else if (levelIndex >= instance._level) {
    console.error(instance.formatMessage(formatArgs));
  }
}

function assertAllowedLog(instance, levelIndex, formatArgs) {
  let level = levels[levelIndex];
  let expect = createLogger.expectation;
  let message = instance.formatMessage(formatArgs);
  if (level === expect.level && expect.pattern.test(message)) {
    expect.matches++;
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

// adds expectWarn(), expectInfo(), etc.
// we slice() so we don't add expectNone()
for (let i in levels.slice(0, -1)) {
  let level = levels[i];
  createLogger['expect' + capitalize(level)] = async function(pattern, options, fn) {
    // expectWarn(pattern, fn)
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }

    let expectation = {
      level,
      pattern,
      matches: 0
    };
    createLogger.expectation = expectation;
    try {
    await fn();
    } finally {
      delete createLogger.expectation;
    }
    if (expectation.matches !== 1) {
      throw new Error(`Expected a log message to match ${pattern} but none did`);
    }
  }
}

function capitalize(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
}

createLogger.configure() // pull in the environment config, in case app doesn't configure

module.exports = createLogger;
