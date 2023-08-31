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

import type { AssetData } from '$lib/asset';
import { derived, type Readable, type Writable } from 'svelte/store';

interface CompareSelectedAssetData extends AssetData {
  isActive: boolean;

  /**
   * Set this asset as the active asset.
   */
  select: () => void;
}

export type CompareSelectedAssetStore = Readable<CompareSelectedAssetData>;

export function createCompareSelectedAssetStore(
  assetData: AssetData,
  activeAssetId: Writable<string | null>,
): CompareSelectedAssetStore {
  return derived([activeAssetId], ([$activeAssetId]) => {
    const id = assetData.id;
    const isActive = $activeAssetId === id;

    return {
      ...assetData,
      isActive,
      select: () => {
        activeAssetId.set(assetData.id);
      },
    };
  });
}
