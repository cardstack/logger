import createLogger, { CreateLogger } from './main';

interface LoggerGlobal {
  __global_cardstack_logger: CreateLogger | undefined;
}

let g = global as unknown as LoggerGlobal;

if (g.__global_cardstack_logger) {
  const path = require('path');
  let ownVersion = require(path.join(__dirname, '..', 'package.json')).version;
  module.exports = g.__global_cardstack_logger.getAPIWrapper(ownVersion);
} else {
  module.exports = g.__global_cardstack_logger = createLogger;
}
