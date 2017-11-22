const logger = require('./main');

// In the future, we can parse the passed version string, and construct
// backwards-compatible API wrappers for older versions
module.exports = function(/* version */) {
  return logger;
}
