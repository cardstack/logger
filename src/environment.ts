import { Level } from "./logger";

export function parseLevelList(str: string) {
  return str.split(',').map(function(pair) {
    return pair.split('=') as [string, Level];
  });
}

export function parseEnv(env: typeof process.env) {
  let result: {
    logLevels: ([string, Level])[];
    defaultLevel?: Level;
  } = {
    logLevels: []
  };
  if (env.DEFAULT_LOG_LEVEL) {
    result.defaultLevel = env.DEFAULT_LOG_LEVEL as Level;
  }

  if (env.LOG_LEVELS) {
    result.logLevels = parseLevelList(env.LOG_LEVELS);
  }

  return result;
}

