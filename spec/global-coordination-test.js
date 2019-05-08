const assert = require('assert');

describe('Global coordination between multiple instances of the module', function() {
  beforeEach(function() {
    delete require.cache[require.resolve('@cardstack/logger')];
    delete global.__global_cardstack_logger;
  });

  it("registers itself globally if it's the first loaded", function() {
    let loggerModule = require('@cardstack/logger');
    assert.strictEqual(loggerModule, global.__global_cardstack_logger);
  });

  it("uses an already-registered version", function() {
    global.__global_cardstack_logger = {
      iAmFirst: true
    };

    let loggerModule = require('@cardstack/logger');
    assert.deepEqual(loggerModule, { iAmFirst: true });
  });
});
