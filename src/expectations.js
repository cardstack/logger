const assert = require('assert');

let expectation = null;

function isExpecting() {
  return !!expectation;
}

function assertAllowedLog(instance, level, formatArgs) {
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
async function expect(level, pattern, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  if (expectation) {
    throw new Error("Unfortunately, nested expectations are not supported. If you feel they are important, please file an issue");
  }

  let count = options.count || 1;

  let ourExpectation = {
    level,
    pattern,
    matches: 0,
    allowed: options.allowed || ['trace', 'debug', 'info']
  };
  expectation = ourExpectation;
  try {
    await fn();
  } finally {
    expectation = null;
  }
  if (ourExpectation.matches === 0) {
    throw new Error(`Expected a log message to match ${pattern} but none did`);
  } else if (ourExpectation.matches !== count) {
    throw new Error(`Wrong number of logs matching ${pattern}. Expected ${count}, got ${ourExpectation.matches}`);
  }
}

function capitalize(str) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
}

module.exports = {
  expect,
  assertAllowedLog,
  isExpecting
}
