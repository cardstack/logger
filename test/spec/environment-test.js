const assert = require('assert');
const env = require('@cardstack/logger/src/environment');

describe("Environment variable handling", function() {
  it("parses a list of channel patterns", function() {
    let result = env.parseLevelList('a=warn,thing:*=debug');
    assert.deepEqual(result, [
        ['a', 'warn'],
        ['thing:*', 'debug']
    ]);
  });
});
