import ourCreateLogger, { CreateLogger } from './main';

interface LoggerGlobal {
  __global_cardstack_logger: CreateLogger | undefined;
}

let g = global as unknown as LoggerGlobal;

let createLogger: CreateLogger;

if (g.__global_cardstack_logger) {
  const path = require('path');
  let ownVersion = require(path.join(__dirname, '..', 'package.json')).version;
  createLogger = g.__global_cardstack_logger.getAPIWrapper(ownVersion);
} else {
  createLogger = g.__global_cardstack_logger = ourCreateLogger;
}

export default createLogger;
