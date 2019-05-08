import createLogger, { CreateLogger } from './main';

interface LoggerGlobal {
  __global_cardstack_logger: CreateLogger | undefined;
}

let g = global as unknown as LoggerGlobal;

if (!g.__global_cardstack_logger) {
  g.__global_cardstack_logger = createLogger;
}

export = g.__global_cardstack_logger!;
