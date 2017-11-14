const assert = require('assert');
const patterns = require('@cardstack/logger/src/patterns');

describe("Channel pattern stuff", function() {
  describe("#compile", function() {
    it("supports wildcard matching", function() {
      let re = patterns.compile('cardstack:*');
      assert.ok(re.test('cardstack:hello'));
      assert.ok(re.test('cardstack:*'));
      assert.ok(re.test('cardstack:'));
    });
    it("properly escapes regex characters", function() {
      let re = patterns.compile('[abc]');
      assert.ok(!re.test('a'));
      assert.ok(re.test('[abc]'));
    });
  });
});
