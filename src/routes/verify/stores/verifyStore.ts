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

import { ROOT_ID } from '$lib/asset';
import type { C2paSourceType } from 'c2pa';
import { get, writable } from 'svelte/store';
import { createC2paReader } from './c2paReader';
import { createHierarchyView, type HierarchyViewStore } from './hierarchyView';
import {
  createManifestRecoverer,
  type ManifestRecovererStore,
} from './manifestRecoverer';

export type SelectedSource =
  | { type: 'local' }
  | { type: 'recovery'; id: number };

interface VerifyStore {
  hierarchyView: Pick<HierarchyViewStore, 'subscribe'>;
  readC2paSource: (source: C2paSourceType) => void;
  recoveredManifestResults: Pick<ManifestRecovererStore, 'subscribe'>;
  recoverManifests: () => void;
}

/**
 * Creates a store representing the state of the verify page, exposing the "public" API used by the page.
 */
export function createVerifyStore(): VerifyStore {
  const selectedSource = writable<SelectedSource>({ type: 'local' });
  const selectedAssetId = writable<string>(ROOT_ID);
  const c2paReader = createC2paReader();

  const manifestRecoverer = createManifestRecoverer(
    selectedSource,
    selectedAssetId,
  );

  const hierarchyView = createHierarchyView(
    selectedSource,
    selectedAssetId,
    c2paReader,
    manifestRecoverer,
  );

  return {
    hierarchyView: hierarchyView,
    readC2paSource: (source: C2paSourceType) => {
      c2paReader.read(source);
      selectedSource.set({ type: 'local' });
    },
    recoveredManifestResults: manifestRecoverer,
    recoverManifests: () => {
      const reader = get(c2paReader);
      if (reader.state === 'success') {
        manifestRecoverer.recover(reader.data);
      }
    },
  };
}

export const verifyStore = createVerifyStore();
