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

import { ROOT_ID, type AssetData, type AssetDataMap } from '$lib/asset';
import type { Loadable } from '$lib/types';
import { derived, get, type Readable, type Writable } from 'svelte/store';
import { createAsset, type ReadableAssetStore } from './asset';
import type { C2paReaderStore } from './c2paReader';
import type { ManifestRecovererStore } from './manifestRecoverer';
import type { SelectedSource } from './verifyStore';

export type ReadableAssetMap = Record<string, ReadableAssetStore>;

interface HierarchyViewStateData {
  assets: ReadableAssetMap;
  ingredientsForAssetId(id: string): AssetData[];
  rootAsset: AssetData;
  selectedAssetStore: Readable<AssetData>;
}

type HierarchyViewState = Loadable<HierarchyViewStateData>;

export type HierarchyViewStore = Readable<HierarchyViewState>;

/**
 * Creates a store representing the state of the asset hierarchy.
 *
 * @param selectedSource Source for the asset hierarchy - either "local" (file provided by user) or "recovery" (returned from manifest recovery service)
 * @param selectedAssetId Store representing the ID of the currently selected asset
 * @param c2paReader Store encapsulating the C2PA SDK logic
 * @param manifestRecoverer Store encapsulating the manifest recovery logic
 */
export function createHierarchyView(
  selectedSource: Readable<SelectedSource>,
  selectedAssetId: Writable<string>,
  c2paReader: C2paReaderStore,
  manifestRecoverer: ManifestRecovererStore,
): HierarchyViewStore {
  return derived(
    [selectedSource, c2paReader, manifestRecoverer],
    ([$selectedSource, $c2paReader, $manifestRecoverer]) => {
      if (['local', 'external'].includes($selectedSource.type)) {
        if ($c2paReader.state === 'success') {
          return {
            state: 'success' as const,
            ...getHierarchyViewData($c2paReader.assetMap, selectedAssetId),
          };
        }

        return { state: $c2paReader.state };
      } else if ($selectedSource.type === 'recovery') {
        if ($manifestRecoverer.state === 'success') {
          const { assetMap } = get(
            $manifestRecoverer.manifests[$selectedSource.id],
          );

          return {
            state: 'success' as const,
            ...getHierarchyViewData(assetMap, selectedAssetId),
          };
        }

        return { state: $manifestRecoverer.state };
      }

      return { state: 'none' as const };
    },
  );
}

function getHierarchyViewData(
  assetMap: AssetDataMap,
  selectedAssetId: Writable<string>,
): HierarchyViewStateData {
  return {
    assets: Object.values(assetMap).reduce((acc, asset) => {
      acc[asset.id] = createAsset(asset, selectedAssetId);

      return acc;
    }, {} as ReadableAssetMap),

    ingredientsForAssetId(assetId: string) {
      return (assetMap[assetId]?.children ?? [])
        .reduce<AssetData[]>((acc, childId) => {
          const childAsset = assetMap[childId];

          if (childAsset) {
            return [...acc, childAsset];
          }

          return acc;
        }, [])
        .sort((a, b) => (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0));
    },

    rootAsset: assetMap[ROOT_ID],

    selectedAssetStore: derived(
      selectedAssetId,
      ($selectedAssetId) => assetMap[$selectedAssetId],
    ),
  };
}
