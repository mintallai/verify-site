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
import debug from 'debug';
import { get, writable, type Readable } from 'svelte/store';
import { createC2paReader } from './c2paReader';
import { createCompareView, type CompareStore } from './compareView';
import { createHierarchyView, type HierarchyViewStore } from './hierarchyView';
import {
  createManifestRecoverer,
  type ManifestRecovererStore,
} from './manifestRecoverer';

const dbg = debug('stores:verifyStore');

export type ViewState = 'hierarchy' | 'compare';

export type SelectedSource =
  | { type: 'local' }
  | { type: 'external'; url: string }
  | { type: 'recovery'; id: number };

interface VerifyStore {
  viewState: Readable<ViewState>;
  hierarchyView: Pick<HierarchyViewStore, 'subscribe'>;
  compareView: CompareStore;
  readC2paSource: (source: C2paSourceType) => void;
  recoveredManifestResults: Pick<ManifestRecovererStore, 'subscribe'>;
  recoverManifests: () => void;
  setCompareView: () => void;
  setHierarchyView: () => void;
  setCompareActiveId: (id: string | null) => void;
}

/**
 * Creates a store representing the state of the verify page, exposing the "public" API used by the page.
 */
export function createVerifyStore(): VerifyStore {
  const viewState = writable<ViewState>('hierarchy');
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

  const compareSelectedAssetIds = writable<(string | null)[]>([null, null]);
  const compareActiveAssetId = writable<string | null>(null);

  const compareView = createCompareView(
    c2paReader,
    compareSelectedAssetIds,
    compareActiveAssetId,
  );

  return {
    viewState,
    hierarchyView,
    compareView,
    readC2paSource: (source: C2paSourceType) => {
      const existingSource = get(selectedSource);
      const incomingSource: SelectedSource =
        typeof source === 'string'
          ? {
              type: 'external',
              url: source,
            }
          : { type: 'local' };

      if (
        existingSource.type === 'external' &&
        incomingSource.type === 'external' &&
        existingSource.url === incomingSource.url
      ) {
        // Don't load a URL if it is already loaded
        return;
      }

      dbg('Reading C2PA source', source);
      c2paReader.read(source);
      dbg('Setting selected source', incomingSource);
      selectedSource.set(incomingSource);
    },
    recoveredManifestResults: manifestRecoverer,
    recoverManifests: () => {
      const reader = get(c2paReader);

      if (reader.state === 'success') {
        manifestRecoverer.recover(reader.data);
      }
    },
    setCompareView: () => {
      viewState.set('compare');
      const id = get(selectedAssetId);
      compareActiveAssetId.set(id);
      compareSelectedAssetIds.set([id, null]);
    },
    setHierarchyView: () => {
      viewState.set('hierarchy');
      selectedAssetId.set(get(compareActiveAssetId) ?? ROOT_ID);
    },
    setCompareActiveId: (id: string | null) => {
      compareActiveAssetId.set(id);
    },
  };
}

export const verifyStore = createVerifyStore();
