import assert from 'assert';
import * as format from '../src/format';

describe("Formatter", function() {
  describe("#color", function() {
    it("supports named colors", function() {
      let result = format.color("hello", 4);
      assert.equal(result, "\u001b[34mhello\u001b[0m");
    });

    it("supports 8-bit colors", function() {
      let result = format.color("hello", 111);
      assert.equal(result, "\u001b[38;5;111mhello\u001b[0m");
    });

    it("supports bolding the text", function() {
      let result = format.color("hello", 4, { bold: true });
      assert.equal(result, "\u001b[1;34mhello\u001b[0m");
    });
  });

  describe("#prefixLines", function() {
    it("Adds the prefix before every line", function() {
      let input = `
hello
world
`.trim();
      let expected = `
- hello
- world
`.trim();

      assert.equal(format.prefixLines("- ", input), expected);
    });
  });

  describe("#runFormatters", function() {
    it("will run formatters found in the formatter dictionary", function() {
      let result = format.runFormatters("%d and %h", [50, {}], {
        h: () => "hello"
      });

      assert.deepEqual(result, ["%d and %s", 50, "hello"]);
    });
  });

  describe("#formatMessage", function() {
    it("prefixes lines with the channel name when interactive", function() {
      let result = format.formatMessage("hi\nhello", [], "test", {
        interactive: true
      });
      assert.equal(result, "  test hi\n  test hello");
    });

    it("prefixes once with the channel name when not interactive", function() {
      let result = format.formatMessage("hi\nhello", [], "test", {
        interactive: false
      });
      assert.equal(result, "test hi\nhello");
    });

    it("runs util formatters", function() {
      let result = format.formatMessage("%s", ["hi"], "test", {
        interactive: true
      });
      assert.equal(result, "  test hi");
    });

    it("runs custom formatters", function() {
      let result = format.formatMessage("%h", [5], "test", {
        formatters: {
          h: () => "hi"
        }
      });
      assert.equal(result, "test hi");
    });

    it("appends a diff", function() {
      let result = format.formatMessage("hi", [], "test", {
        diff: 700
      });
      assert.equal(result, "test hi +700ms");
    });

    it("prepends a timestamp", function() {
      let result = format.formatMessage("hi", [], "test", {
        timestamp: new Date('2012-12-12')
      });
      assert.equal(result, "2012-12-12T00:00:00.000Z test hi");
    });

    it("colors the channel name and millisecond diff", function() {
      let result = format.formatMessage("hi", [], "test", {
        color: 4,
        diff: 120
      });
      let boldColorChannel = format.color("test", 4, {bold:true});
      let colorDiff = format.color("+120ms", 4);
      assert.equal(result, `${boldColorChannel} hi ${colorDiff}`);
    });
  });
});
