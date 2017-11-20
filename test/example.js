const logger = require('@cardstack/logger');

// create some before the configure call to check it invalidates properly
let dep = logger('dependency');
let noisy = logger('whiny-dependency');

logger.configure({
  defaultLevel: 'warn',
  logLevels: [
    ['whiny-dependency', 'error'],
    ['cardstack:*', 'info']
  ]
});

let a = logger('cardstack:a');
let b = logger('cardstack:b');


// dep trace, debug, ... log
// noisy trace, debug, ... log
// a trace, debug, ... log
// b trace, debug, ... log
for (let log of [dep, noisy, a, b]) {
  for (let level of ['trace', 'debug', 'info', 'warn', 'error', 'log']) {
    log[level](level);
  }
}
