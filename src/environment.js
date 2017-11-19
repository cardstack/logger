function parseLevelList(str) {
  return str.split(',').map(function(pair) {
    return pair.split('=');
  });
};

function parseEnv(env) {
  let result = {
    logLevels: []
  };
  if (env.DEFAULT_LOG_LEVEL) {
    result.defaultLevel = env.DEFAULT_LOG_LEVEL;
  }

  if (env.LOG_LEVELS) {
    result.logLevels = parseLevelList(env.LOG_LEVELS);
  }

  return result;
}

module.exports = {
  parseLevelList,
  parseEnv
};
