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

  it("calls getAPIWrapper() on an already-registered version", function() {
    const stub = Symbol('stub');
    global.__global_cardstack_logger = {
      getAPIWrapper() { return stub; }
    };

    let loggerModule = require('@cardstack/logger');
    assert.strictEqual(loggerModule, stub);
  });
});
