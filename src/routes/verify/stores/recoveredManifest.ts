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
import type { ManifestRecoveryResult } from '$lib/manifestRecovery';
import { derived, type Readable, type Writable } from 'svelte/store';
import type { SelectedSource } from './verifyStore';

export interface RecoveredManifestData extends ManifestRecoveryResult {
  isSelected: boolean;
  select: () => void;
}

export type ReadableRecoveredManifestStore = Readable<RecoveredManifestData>;

/**
 * Creates a store representing an individual manifest returned from the manifest recovery service.
 *
 * @param manifest Underlying recovered manifest data
 * @param id Unique ID representing this manifest
 * @param selectedSource Selected source store - used to update the selected source when a recovered manifest is selected
 * @param selectedAssetId Store representing the ID of the currently selected asset
 */
export function createRecoveredManifest(
  manifest: ManifestRecoveryResult,
  id: number,
  selectedSource: Writable<SelectedSource>,
  selectedAssetId: Writable<string>,
): ReadableRecoveredManifestStore {
  return derived(selectedSource, ($selectedSource) => ({
    ...manifest,
    isSelected:
      $selectedSource.type === 'recovery' ? $selectedSource.id === id : false,
    select: () => {
      selectedSource.set({ type: 'recovery', id });
      selectedAssetId.set(ROOT_ID);
    },
  }));
}
