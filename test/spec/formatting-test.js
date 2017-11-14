const assert = require('assert');
const format = require('@cardstack/logger/src/format');

describe('Color formatting', function() {
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
