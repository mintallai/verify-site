import memoize from 'lodash/memoize';
import debug from 'debug';

const dbg = debug('config');

export const SITE_VERSION = process.env.GIT_REVISION;

interface EnvConfig {
  env: 'dev' | 'stage' | 'prod';
  config: any;
}

const defaultConfig: EnvConfig = {
  env: 'prod',
  config: {},
};

export const getConfig = memoize<() => Promise<EnvConfig>>(async () => {
  try {
    const res = await fetch('/env.json');
    const data = await res.json();
    dbg('Retrieved config with environment %s', data.env ?? 'prod', data);
    return data;
  } catch (err) {
    dbg('No env file found, defaulting to prod');
    return defaultConfig;
  }
});
