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

import { resultToAssetMap, type AssetDataMap } from '$lib/asset';
import { getLegacySdk, getSdk } from '$lib/sdk';
import type { Loadable } from '$lib/types';
import type { Source as C2paSource, C2paSourceType } from 'c2pa';
import { writable, type Readable } from 'svelte/store';
import { createGenericError, error } from '../../../features/errors';
interface SourceData {
  assetMap: AssetDataMap;
  data: C2paSource;
}

export type SourceState = Loadable<SourceData>;
export type ReadableSource = Readable<SourceState>;

export interface C2paReaderStore extends Readable<SourceState> {
  /**
   * @param source Source to read c2pa data from
   */
  read: (source: C2paSourceType) => Promise<void>;
}

/**
 * Creates a store encapsulating the C2PA SDK file reading logic.
 */
export function createC2paReader(): C2paReaderStore {
  const { subscribe, set } = writable<SourceState>({ state: 'none' });

  return {
    subscribe,
    read: async (source: C2paSourceType) => {
      set({ state: 'loading' });
      try {
        const sdk = await getSdk();

        const result = await sdk.read(source);

        if (!result.manifestStore && (await hasLegacyCredentials(source))) {
          // @TODO handle legacy credentials
          set({ state: 'none' });
          return;
        }

        const assetMap = await resultToAssetMap(result);

        set({
          state: 'success',
          assetMap,
          data: result.source,
        });
      } catch (e) {
        console.error(e);
        error.trigger(createGenericError());
        set({ state: 'none' });
      }
    },
  };
}

async function hasLegacyCredentials(source: C2paSourceType): Promise<boolean> {
  const legacySdk = await getLegacySdk();
  const legacyResult = await legacySdk.processImage(source);
  return legacyResult.exists;
}
