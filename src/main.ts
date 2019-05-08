import tty from 'tty';
import { choose as chooseColor } from './color';
import Logger, { Level } from './logger';
import { parseEnv } from './environment';
import { findMatch, compile } from './patterns';
import { makeExpectHandler, ExpectOptions, ExpectCallback } from './expectations';

const instances: Logger[] = [];

const config = {
  defaultLevel: 'info' as Level,
  interactive: tty.isatty(2), // STDERR is always file descriptor 2
  logLevels: [] as ([RegExp, Level])[],
  timestamps: process.env.LOG_TIMESTAMPS !== 'false'
};

const createLogger = Object.assign(function createLogger(name: string) {
  let level = findMatch(config.logLevels, name, config.defaultLevel);
  let log = new Logger(name, level, {
    color: chooseColor(name),
    interactive: config.interactive
  });
  instances.push(log);
  return log;
}, {
  configure(appConfig: { defaultLevel?: Level, logLevels?: ([string, Level])[] } = {}) {
    let overrides = parseEnv(process.env);

    config.defaultLevel = overrides.defaultLevel || appConfig.defaultLevel || 'info';

    let logLevels = (appConfig.logLevels || []).concat(overrides.logLevels);
    config.logLevels = logLevels.map(([pattern, level]) => [compile(pattern), level]);

    instances.forEach(function(log) {
      log.level = findMatch(config.logLevels, log.name, config.defaultLevel);
    });
  },
  getAPIWrapper(version: string) {
    // In the future, we can parse the passed version string, and construct
    // backwards-compatible API wrappers for older versions
    return this;
  },

  expectTrace: makeExpectHandler('trace'),
  expectDebug: makeExpectHandler('debug'),
  expectInfo: makeExpectHandler('info'),
  expectWarn: makeExpectHandler('warn'),
  expectError: makeExpectHandler('error'),
});

export default createLogger;
export type CreateLogger = typeof createLogger;

createLogger.configure() // pull in the environment config, in case app doesn't configure

