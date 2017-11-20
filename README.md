# @cardstack/logger

A fork of tj's [`debug`](https://github.com/visionmedia/debug), modified
to add log levels, and better global configuration support. This readme
only documents the differences.

## Installation

```bash
$ npm install @cardstack/logger
```

## Browser support

We're focused on node logging, and temporarily removing browser logging.
We will likely add it back in.

## Application-level (global) config

It's possible for multiple versions of a library to be loaded by
different dependent modules. While usually this causes no issues,
for something like a logger it's best to be able to configure it in
once place, and have multiple versions co-operate and share this
configuration.

So, the first loaded instance of `@cardstack/logger` "wins", and
registers itself to be used globally. Other instances loaded later will
delegate to that global logger.

This configuation is done via the [`configure()`](#configure) and
[`registerFormatter()`](#registerformatter) methods on the module
instance.

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
- `log` - For when you don't want to decide. These messages are _always_
  displayed, so should be used during active development only. It's a
  separate logging level so as to be easy to search for or detect with
  linters. 

```
let log = require('@cardstack/logger')('channel-name');

log.log("ok, the crash isn't coming from the require step");

log.info('Application starting');
if (!GlobalCache) {
  log.warn('The GlobalCache module hasn't been loaded. The application may run slower than expected');
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

You can configure logging-levels per-channel, as well as specify the
default logging level for unconfigured channels.

When you specify a logging level, messages of that level and higher are
shown. `trace` is the lowest level, and `error` is the highest. You can
also specify `none` to silence all messages.

If you don't specify a default logging level, `info` is used.

If multiple patterns match a channel, the last-specified one will apply.

Application default logging levels are set via the [`configure`
method](#configure), or set at runtime via [environment
variables](#environment-variables)

## Docs

### `configure`
Use the `configure` method on the module instance to set
application-level defaults. Library authors should _not_ call this
method.

```
require('@cardstack/logger').configure({
  defaultLevel: 'warn',
  logLevels: [
    ['cardstack:*', 'info'],
    ['noisy-module', 'error']
  ]
});
```

### Environment variables
Logging levels for a given application run can be set with environment
variables. This overrides application defaults set with `configure`.

```
DEFAULT_LOG_LEVEL=warn LOG_LEVELS='cardstack:*=info,noisy-module=trace' node app.js
```

You can also turn off the timestamping (ms diffs or absolute timestamps,
depending on whether it's going to a tty) with `LOG_TIMESTAMPS=false`

### `registerFormatter`
To add a `%`-style formatter to use in your log messages, use the
`registerFormatter` method. Trying to register a second formatter for
the same letter will cause an error.
```
const logger = require('@cardstack/logger')
// Display as hex
logger.registerFormatter('x', function(val) {
  return parseInt(val).toString(16);
});

logger('cardstack:example').info('%d is "%x" in hex', 51966, 51966);
// 51966 is "cafe" in hex
```


## License

(The MIT License)

Copyright (c) 2014-2017 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
