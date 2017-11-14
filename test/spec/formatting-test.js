const assert = require('assert');
const format = require('@cardstack/logger/src/format');

describe('Formatter', function() {
  describe('#color', function() {
    it('supports named colors', function() {
      let result = format.color('hello', 4);
      assert.equal(result, '\u001b[34mhello\u001b[0m');
    });

    it('supports 8-bit colors', function() {
      let result = format.color('hello', 111);
      assert.equal(result, '\u001b[38;5;111mhello\u001b[0m');
    });

    it('supports bolding the text', function() {
      let result = format.color('hello', 4, { bold: true });
      assert.equal(result, '\u001b[1;34mhello\u001b[0m');
    });
  });

  describe('#prefixLines', function() {
    it("Adds the prefix before every line", function() {
      let input = `
hello
world
`.trim();
      let expected = `
- hello
- world
`.trim();

      assert.equal(format.prefixLines('- ', input), expected);
    });
  });

  describe("#runFormatters", function() {
    it("will run formatters found in the formatter dictionary", function() {
      let result = format.runFormatters(["%d and %h", 50, {}], {
        h: () => 'hello'
      });

      assert.deepEqual(result, ["%d and %s", 50, 'hello']);
    });
  });
});
