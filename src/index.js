if (global.__global_cardstack_logger) {
  const path = require('path');
  let ownVersion = require(path.join(__dirname, '..', 'package.json')).version;
  module.exports = global.__global_cardstack_logger.getAPIWrapper(ownVersion);
} else {
  module.exports = global.__global_cardstack_logger = require('./main');
}
