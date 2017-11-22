# @cardstack/logger

The logging library used by the Cardstack Hub and official plugins.
Per-channel logging level support, graceful co-operation and
configuration sharing between multiple loaded instances (even
across versions), and first-class test assertion support.

Inspiration (and a little code) taken from tj's
[`debug`](https://github.com/visionmedia/debug).

## Installation

```bash
$ npm install @cardstack/logger
```

## Browser support

We're focused on node.js logging, though we may add browser support in
the future.

## Log levels

Some log messages are useful more often than others, some are more noisy
than others, and some are urgent and always require attention. We add
several logging levels to enable effectively listening to or silencing
certain channels at runtime.

- `error` - A fatal error has occurred. The application won't function
  without user attention.
- `warn` - Something that may be a problem under certain conditions has
  occurred.
- `info` - Information that provides feedback to the user, or is likely
  to be useful in recorded logs when investigating surprising behavior
  after the fact.
- `debug` - Information likely to be useful during development or
  debugging.
- `trace` - Dense, noisy information only useful when digging deeply
  into a system.
- `log` - A convenience for active development. These messages are _always_
  displayed regardless of configuration, and aren't considered by the
  expectation system.

## Logging usage

The main export of `@cardstack/logger` is a function which creates
namespaced loggers. These loggers have a method for each logging level:

```js
let log = require('@cardstack/logger')('my-module:subsystem');

log.log("ok, this file is actually required at least");

log.info('Application starting');
if (typeof GlobalCache === 'undefined') {
  log.warn("The GlobalCache module hasn't been loaded. The application may run slower than expected");
}

try {
  require('dependency');
} catch (e) {
  log.error('Could not load dependency! Please install it');
  process.exit(1);
}

if (loadOptionalModules) {
  log.debug('Loading the optional modules');
} else {
  log.debug('Skipping optional modules');
}

setInterval(function() {
  log.trace('refreshing plugins');
  refreshPlugins();
}, 50);
```

## Application and run-time configuration

You can specify default logging levels for channels in your
application's entry point. Try to do this as early as you can, before
requiring other modules, to avoid messages being logged before you set
the configuration.

When you set a logging level, all messages of that level and higher will
be displayed (lowest is `trace`, and highest is `error`). You can also
set the level to `none` to suppress all messages.

The default logging level is `info`.

Even if multiple versions are installed via different dependencies, we
take care to co-ordinate and make sure this configuration is applied to
all of them. 

If multiple patterns match a channel, the last-specified one will apply.

Note - this should only be done in an _application_. If you're shipping
a library to be consumed by others, you should _not_ call this function -
you should leave users to decide it at the application level.

```js
// app.js
const logger = require('@cardstack/logger');
const dep = require('dependency');

logger.configure({
  defaultLevel: 'warn',
  logLevels: [
    ['app:*', 'info'], // Our info messages are all pretty useful
    ['dependency', 'error'] // This lib spams warnings that aren't actually important
  ]
});

let log = logger('app:index');
log.info('starting up');

if (dep.shouldRun()) {
  log.debug('running dependency');
  dep.fn();
}

log.info('all done');
```

```
$ node app.js
  app:index starting up
  app:index all done
```

You can then override these at runtime via environment variables:
```
$ LOG_LEVELS='*=none,app:*=debug,dependency=warn' node app.js
  app:index starting up
  app:index running dependency
  dependency Woah this isn't linux, don't you believe in free software?!
  app:index all done
```

## Test expectations

Error messages and logs are an important part of developer experience,
and worth testing. So, we include expectation helpers to assert that
certain log messages occur, and that unexpected ones don't. As a bonus,
it's sometimes easier to test that a given log message occurs, than to
inspect private state.

There exists an `expect...` method on the logger module for each logging
level. It accepts a regex to match against the message, an optional set
of options, and a function to execute to trigger the expected logging.

```js
const logger = require('@cardstack/logger');
let log = logger('test');
// simple usage
await logger.expectInfo(/message/, async function() {
  await someAsyncSetup();
  log.trace('ignored');
  log.info('message');
});

// advanced usage
await logger.expectWarn(/whoops/, { count: 2, allowed: ['error']}, someFunctionThatLogsAnError);
```
