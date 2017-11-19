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

  it("gets config from an environment object", function() {
    let input = {
      DEFAULT_LOG_LEVEL: 'warn',
      LOG_LEVELS: 'this=that,third=other'
    };
    let result = env.parseEnv(input);
    assert.deepEqual(result, {
      defaultLevel: 'warn',
      logLevels: [
        ['this', 'that'],
        ['third', 'other']
      ]
    });
  });

  it("returns something useful when no overrides are present", function() {
    let result = env.parseEnv({});
    assert.deepEqual(result, {
      logLevels: []
    });
  });
});
