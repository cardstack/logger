import assert from 'assert';
import logger from '@cardstack/logger';

const log = logger('expect');

describe("Logger expectations", function() {
  it("pass if the expected messages are logged", async function() {
    await logger.expectInfo(/message/, function() {
      log.info('message');
    });
  });

  it("fail if the log does not happen", async function() {
    try {
      await logger.expectInfo(/message/, function() {/* noop */});
    } catch (e) {
      assert.equal(e.message, "Expected a log message to match /message/ but none did");
      return;
    }
    assert.fail("expectInfo should throw if it was not matched");
  });

  it("fail if the wrong number of matches occur", async function() {
    try {
      await logger.expectInfo(/message/, {count: 2}, function() {
        log.info('message');
      });
    } catch (e) {
      assert.equal(e.message, "Wrong number of logs matching /message/. Expected 2, got 1");
      return;
    }
    assert.fail("expectInfo should throw if the wrong number of logs happen");
  });

  it("fail if not-allowed log levels are triggered", async function arbitraryFunctionName() {
    try {
      await logger.expectInfo(/message/, function() {
        log.warn('shit');
        log.info('message');
      });
    } catch (e) {
      assert.ok(/An unexpected warn was logged/.test(e.message), "The error contains the level of the unexpected log");
      assert.ok(/shit/.test(e.message), "The error contains the original message");
      return;
    }
    assert.fail("expectInfo should throw if an unexpected warn is logged");
  });

  it("pass if only allowed non-matching log levels are triggered", async function() {
    await logger.expectInfo(/message/, {allowed: ['warn']}, function() {
      log.warn('this is fine');
      log.info('message');
    });
  });

  it("support async callbacks", async function() {
    await logger.expectInfo(/message/, async function() {
      await Promise.resolve();
      log.info('message');
    });
  });

  it("detect attempts to nest expectations", async function() {
    try {
      await logger.expectInfo(/message/, async function() {
        await logger.expectWarn(/warning/, function() {});
      });
    } catch (e) {
      assert.equal(e.message, "Unfortunately, nested expectations are not supported. If you feel they are important, please file an issue");
      return;
    }
    assert.fail("Nested expectations should fail");
  });
});
