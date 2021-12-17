/* eslint-disable @typescript-eslint/camelcase */
import createLogger, { CreateLogger } from './main';

export type { default as Logger, Level } from './logger';

interface LoggerGlobal {
  __global_cardstack_logger: CreateLogger | undefined;
}

let g = global as unknown as LoggerGlobal;

if (!g.__global_cardstack_logger) {
  g.__global_cardstack_logger = createLogger;
}

// @ts-ignore
export = g.__global_cardstack_logger!; // ts-ignoring this so we dont get spurrious lint errors when using ES6 modules via ESM
