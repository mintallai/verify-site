import debug from 'debug';
import memoize from 'lodash/memoize';
import { version } from '$app/environment';

const dbg = debug('config');

export const SITE_VERSION = version;
export const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZGtvem1hLWFkb2JlIiwiYSI6ImNsOTV1aHFxYTJoOXM0MG14cTlzbTdxYmEifQ.xR4EY81HcCeRRF-zycgsMw';

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
    dbg(
      'Retrieved config with environment %s',
      data?.env ?? defaultConfig.env,
      data,
    );
    return data ?? defaultConfig;
  } catch (err) {
    dbg('No env file found, defaulting to prod');
    return defaultConfig;
  }
});
