const assert = require('assert');

const levels = require('./levels').default;

function isExpecting(logModule) {
  return !!logModule.expectation;
}

function assertAllowedLog(logModule, instance, levelIndex, formatArgs) {
  let {expectation} = logModule;
  let level = levels[levelIndex];
  let message = instance.formatMessage(formatArgs);
  if (level === expectation.level && expectation.pattern.test(message)) {
    expectation.matches++;
  } else if (!expectation.allowed.includes(level)) {
    // Passing instance[level] in here removes it and everything lower from the stack trace.
    // This means the first line of the stack will be the user function that attempted the
    // disallowed log
    assert.fail(null, null, `An unexpected ${level} was logged:\n${message}`, null, instance[level]);
  }
}

function addExpectMethods(createLogger) {
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

      if (createLogger.expectation) {
        throw new Error("Unfortunately, nested expectations are not supported. If you feel they are important, please file an issue");
      }

      let count = options.count || 1;

      let expectation = {
        level,
        pattern,
        matches: 0,
        allowed: options.allowed || ['trace', 'debug', 'info']
      };
      createLogger.expectation = expectation;
      try {
      await fn();
      } finally {
        delete createLogger.expectation;
      }
      if (expectation.matches === 0) {
        throw new Error(`Expected a log message to match ${pattern} but none did`);
      } else if (expectation.matches !== count) {
        throw new Error(`Wrong number of logs matching ${pattern}. Expected ${count}, got ${expectation.matches}`);
      }
    }
  }
}

function capitalize(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
}

module.exports = {
  addExpectMethods,
  assertAllowedLog,
  isExpecting
}
