import createLogger from './main';

// In the future, we can parse the passed version string, and construct
// backwards-compatible API wrappers for older versions
export default function(_version: string) {
  return createLogger;
}
