import assert from 'assert';
import Logger, { Level } from './logger';

let expectation: {
  level: Level;
  pattern: RegExp;
  matches: number;
  allowed: string[];
} | null = null;

export function assertAllowedLog(instance: Logger, level: Level, msg: string, params: any[]) {
  if (level === 'none') {
    throw new Error("You can't expectNone");
  }

  if (!expectation) {
    return false;
  }
  let message = instance.formatMessage(msg, params);
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

export interface ExpectOptions {
  count?: number;
  allowed?: string[];
}

export type ExpectCallback = () => void | Promise<void>;

export function makeExpectHandler(level: Level) {
  async function expect(pattern: RegExp, fn: ExpectCallback): Promise<void>
  async function expect(pattern: RegExp, options: ExpectOptions, fn: ExpectCallback): Promise<void>
  async function expect(pattern: RegExp, maybeOptions: ExpectOptions | ExpectCallback, maybeFn?: ExpectCallback): Promise<void> {
    let fn: ExpectCallback;
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
  return expect;
}

