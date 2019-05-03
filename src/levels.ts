const levels = ['trace', 'debug', 'info', 'warn', 'error', 'none'] as string[] & { LOG: Symbol };
levels.LOG = Symbol('log.log');
export = levels;

