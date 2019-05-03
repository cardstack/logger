export function parseLevelList(str: string) {
  return str.split(',').map(function(pair) {
    return pair.split('=');
  });
};

export function parseEnv(env: typeof process.env) {
  let result: {
    logLevels: string[][];
    defaultLevel?: string;
  } = {
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

