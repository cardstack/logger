const assert = require('assert');

xdescribe('Multiple instances', function() {
  it('share one configuration', function() {
    delete require.cache['@cardstack/logger'];
    let count = 0;
    let logger = require('@cardstack/logger');
    logger.registerFormatter('z', function() {
      count++;
      return 'z';
    });
    logger('channel').log('hey %z');

    delete require.cache['@cardstack/logger'];
    require('@cardstack/logger')('channel').log('hey again, %z');

    assert.equal(count, 2, 'Later instantiated loggers share formatters');
  });
});
