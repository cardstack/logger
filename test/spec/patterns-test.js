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

  describe("#findMatch", function() {
    it("finds the last matching value from a list", function() {
      let rules = [
        [/q/, 0],
        [/[abc]/, 1],
        [/./, 2]
      ];
      let result = patterns.findMatch(rules, 'b');
      assert.equal(result, 2);
    });

    it("returns the default if none match", function() {
      let rules = [
        [/q/, 0]
      ];
      let result = patterns.findMatch(rules, 'b', 'none');
      assert.equal(result, 'none');
    });
  });
});
