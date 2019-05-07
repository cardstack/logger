import assert from 'assert';
import Logger, { Level } from './logger';

let expectation: {
  level: Level,
  pattern: RegExp,
  matches: number,
  allowed: string[]
} | null = null;

export function isExpecting() {
  return !!expectation;
}

export function assertAllowedLog(instance: Logger, level: Level, formatArgs: [string, any]) {
  if (!expectation) {
    return false;
  }
  let message = instance.formatMessage(formatArgs);
  if (level === expectation.level && expectation.pattern.test(message)) {
    expectation.matches++;
  } else if (!expectation.allowed.includes(level)) {
    // Passing instance[level] in here removes it and everything lower from the stack trace.
    // This means the first line of the stack will be the user function that attempted the
    // disallowed log
    assert.fail(null, null, `An unexpected ${level} was logged:\n${message}`, undefined, instance[level]);
  }
  return true;
}

interface ExpectOptions {
  count?: number;
  allowed?: string[];
}

type callback = () => void | Promise<void>;

export async function expect(level: Level, pattern: RegExp, fn: callback): Promise<void>
export async function expect(level: Level, pattern: RegExp, options: ExpectOptions, fn: callback): Promise<void>
export async function expect(level: Level, pattern: RegExp, maybeOptions: ExpectOptions | callback, maybeFn?: callback): Promise<void> {

  let fn: callback;
  let options: ExpectOptions;

  if (typeof maybeOptions === 'function') {
    fn = maybeOptions;
    options = {};
  } else {
    fn = maybeFn!;
    options = maybeOptions;
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

function capitalize(str: string) {
  return str.slice(0,1).toUpperCase() + str.slice(1);
}

