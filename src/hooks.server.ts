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

import type { Handle } from '@sveltejs/kit';
import { readFile } from 'fs/promises';

export const handle = (async ({ event, resolve }) => {
  const newrelicScript = await readFile('etc/newrelic.html', {
    encoding: 'utf-8',
  });

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('%newrelic%', newrelicScript),
  });

  return response;
}) satisfies Handle;
