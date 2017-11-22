# @cardstack/logger

<img width="647" src="https://user-images.githubusercontent.com/71256/29091486-fa38524c-7c37-11e7-895f-e7ec8e1039b6.png">

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

For a utility library like a logger, it is possible for multiple
versions to be loaded by different dependent modules. An application
consuming multiple libraries, using different versions of the logger,
should be able to specify configuration about logging levels in one
place. So, the first loaded instance of the logger "wins" and registers
itself to be used globally. Other instances loaded later will delegate
to the first loaded. This also allows configuration to apply to all
libraries doing logging.

Configuration options available:
```
require('@cardstack/logger').configure({
  // logging levels are discussed in more detail below
  defaultLevel: 'warn',
  loggerLevels: {
    'cardstack:*': 'info'
  }
});
```

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

log.info('Application starting');
if (!GlobalCache) {
  log.warning('The GlobalCache module hasn't been loaded. The application may run slower than expected');
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

You can configure logging levels per-channel, as well as specify the
default logging levels for any channels not explicitly configured.

When you specify a logging level, messages of that level and higher are
shown. `trace` is the lowest level, and `error` is the highest. You can
also specify `none` to silence all messages.

The internal default logging level is `info`.

Default logger level can be specified by the `defaultLevel`
configuration option, or overridden at runtime with the
`LOGGER_DEFAULT_LEVEL` environment variable.

Per-channel levels can be specified for `configure` with an object, or
overridden at runtime with the `LOGGER_LEVELS` environment variable,
which is a comma-separated list of `pattern=level` pairs:
```
LOGGER_LEVELS='cardstack:noisy-plugin=none,cardstack:hub=debug' node app.js
```
If multiple patterns match, it will be the last-specified rule that
applies.


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
