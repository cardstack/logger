const assert = require('assert');
const logger = require('@cardstack/logger');

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
  xit("pass if only allowed non-matching log levels are triggered", async function() {});
  xit("fail if not-allowed log levels are triggered", async function() {});
  xit("support async callbacks", async function() {});
  xit("detect attempts to nest expectations", async function() {});
});
