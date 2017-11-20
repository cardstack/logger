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
      assert.ok(e instanceof Error, "The expectation rejects with an error");
      assert.equal(e.message, "Expected a log message to match /message/ but none did");
      return;
    }
    assert.fail("expectInfo should throw if it was not matched");
  });

  xit("fail if the wrong number of matches occur", async function() {});
  xit("pass if only allowed non-matching log levels are triggered", async function() {});
  xit("fail if not-allowed log levels are triggered", async function() {});
  xit("support async callbacks", async function() {});
  xit("detect attempts to nest expectations", async function() {});
});
