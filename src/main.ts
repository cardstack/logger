import tty from 'tty';
import assert from 'assert';

import { choose as chooseColor } from './color';
import Logger, { Level } from './logger';
import { parseEnv } from './environment';
import { findMatch, compile } from './patterns';
import { expect, ExpectOptions, ExpectCallback } from './expectations';
import compatibility from './compatibility';

function createLogger(name: string) {
  let level = findMatch(createLogger.config.logLevels, name, createLogger.config.defaultLevel);
  let log = new Logger(name, level, {
    color: chooseColor(name),
    interactive: createLogger.config.interactive
  });
  createLogger.instances.push(log);
  return log;
}

export type CreateLogger = typeof createLogger;

createLogger.config = {
  defaultLevel: 'info' as Level,
  interactive: tty.isatty(2), // STDERR is always file descriptor 2
  logLevels: [] as ([RegExp, Level])[],
  timestamps: process.env.LOG_TIMESTAMPS !== 'false'
};
createLogger.instances = [] as Logger[];

createLogger.configure = function(appConfig: { defaultLevel?: Level, logLevels?: ([string, Level])[] } = {}) {
  let overrides = parseEnv(process.env);

  createLogger.config.defaultLevel = overrides.defaultLevel || appConfig.defaultLevel || 'info';

  let logLevels = (appConfig.logLevels || []).concat(overrides.logLevels);
  createLogger.config.logLevels = logLevels.map(([pattern, level]) => [compile(pattern), level]);

  createLogger.instances.forEach(function(log) {
    log.level = findMatch(createLogger.config.logLevels, log.name, createLogger.config.defaultLevel);
  });
}

let expectationMethods = {
  expectTrace(pattern: RegExp, options: ExpectOptions, fn: ExpectCallback) {
    return expect('trace', pattern, options, fn);
  },
  expectDebug(pattern: RegExp, options: ExpectOptions, fn: ExpectCallback) {
    return expect('debug', pattern, options, fn);
  },
  expectInfo(pattern: RegExp, options: ExpectOptions, fn: ExpectCallback) {
    return expect('info', pattern, options, fn);
  },
  expectWarn(pattern: RegExp, options: ExpectOptions, fn: ExpectCallback) {
    return expect('warn', pattern, options, fn);
  },
  expectError(pattern: RegExp, options: ExpectOptions, fn: ExpectCallback) {
    return expect('error', pattern, options, fn);
  }
};

Object.assign(createLogger, expectationMethods);

createLogger.configure() // pull in the environment config, in case app doesn't configure
export default createLogger;

// at the end, so as to be careful about a cyclical dependency.
createLogger.getAPIWrapper = compatibility;
