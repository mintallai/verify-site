// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { version } from '$app/environment';
import debug from 'debug';
import memoize from 'lodash/memoize';

const dbg = debug('config');

export const SITE_VERSION = version;

interface EnvConfig {
  env: 'dev' | 'stage' | 'prod';
  config: Record<string, unknown>;
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
