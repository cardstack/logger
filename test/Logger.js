const Logger = require('@cardstack/logger/src/logger');

let log = new Logger('test', 'info', {
  log: console.error,
  color: 1,
  interactive: true
});

log.debug('debug');
log.warn('warn');

setTimeout(()=>log.log('eyyy'), 500);
