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

import {
  selectEditsAndActivity,
  selectFormattedGenerator,
  selectProducer,
  selectSocialAccounts,
  type C2paReadResult,
  type Ingredient,
  type Manifest,
  type ManifestStore,
  type TranslatedDictionaryCategory,
} from 'c2pa';
import { locale } from 'svelte-i18n';
import { get } from 'svelte/store';
import { DEFAULT_LOCALE } from './i18n';
import {
  selectGenerativeInfo,
  type GenerativeInfo,
} from './selectors/generativeInfo';
import { selectReviewRatings } from './selectors/reviewRatings';
import {
  selectValidationResult,
  type ValidationStatusResult,
} from './selectors/validationResult';
import type { Disposable } from './types';

/**
 * Asset data required for the verify UI.
 */
export type AssetData = {
  id: string;
  manifestData: ManifestData | null;
  thumbnail: string | null;
  title: string | null;
};

export type ManifestData = {
  children: string[];
  claimGenerator: string;
  date: Date | null;
  editsAndActivity: TranslatedDictionaryCategory[] | null;
  generativeInfo: GenerativeInfo | null;
  producer: string | null;
  reviewRatings: ReturnType<typeof selectReviewRatings>;
  signatureInfo: Manifest['signatureInfo'];
  socialAccounts: ReturnType<typeof selectSocialAccounts>;
  validationResult: ValidationStatusResult;
};

export type AssetDataMap = Record<string, AssetData>;

export type DisposableAssetDataMap = Disposable<{
  // Flattened map of asset data, keyed by asset ID
  assetMap: AssetDataMap;
}>;

export const ROOT_ID = '0';

/**
 *
 * @param result Result from C2PA SDK
 * @returns Object containing a flattened map of asset data (keyed by asset ID), along with a disposer
 *
 * This will recursively process all nodes in the provenance tree, adding to (mutating) the `assetStore`
 * as the nodes are traversed. It also returns a disposer that should be called when this asset
 */
export async function resultToAssetMap({
  manifestStore,
  source,
}: C2paReadResult): Promise<DisposableAssetDataMap> {
  const disposers: (() => void)[] = [];
  const rootValidationResult = manifestStore?.validationStatus
    ? selectValidationResult(manifestStore?.validationStatus)
    : null;
  const { hasError, hasOtgp } = rootValidationResult ?? {};

  function dispose() {
    while (disposers.length) {
      disposers.pop()?.();
    }
  }

  if (!manifestStore || hasError || hasOtgp) {
    const id = ROOT_ID;
    const thumbnail = source.thumbnail?.getUrl();

    disposers.push(thumbnail.dispose);

    const assetMap = {
      [id]: {
        // @TODO filename if none present?
        id,
        title: source.metadata.filename ?? null,
        thumbnail: thumbnail.url ?? null,
        manifestData: null,
      },
    };

    // Return early if we don't have a manifestStore
    if (!manifestStore) {
      return {
        assetMap,
        dispose,
      };
    }
  }

  const assetStore: AssetDataMap = {};

  // Start processing the provenance tree
  // This conditional should always resolve to `true`, it's more to help TypeScript out
  if (manifestStore && rootValidationResult) {
    await manifestStoreToAssetData(manifestStore, rootValidationResult);
  }

  // Convert a manifest to an asset usable by the verify UI and add it to the map
  // Any processing here should be specific to keys on the root manifest
  async function manifestStoreToAssetData(
    manifestStore: ManifestStore,
    validationResult: ValidationStatusResult,
  ): Promise<AssetData> {
    const { activeManifest: manifest } = manifestStore;

    // Attempt to use a thumbnail on the manifest if found
    let thumbnail = manifest.thumbnail?.getUrl();

    // If no thumbnail exists on the claim and we have a valid manifest,
    // we can use the source thumbnail
    if (!thumbnail && validationResult.statusCode === 'valid') {
      thumbnail = source.thumbnail?.getUrl();
    }

    const asset = {
      id: ROOT_ID,
      title: manifest.title,
      thumbnail: thumbnail?.url ?? null,
      manifestData: await getManifestData(manifest, validationResult, ROOT_ID),
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetStore[ROOT_ID] = asset;

    return asset;
  }

  // Convert an ingredient to an asset usable by the verify UI and add it to the map
  // Any processing here should be specific to keys on an ingredient
  async function ingredientToAssetData(
    ingredient: Ingredient,
    id: string,
  ): Promise<AssetData> {
    const thumbnail = ingredient.thumbnail?.getUrl();
    const validationResult = selectValidationResult(
      ingredient.validationStatus,
    );
    const asset = {
      id,
      title: ingredient.title,
      thumbnail: thumbnail?.url ?? null,
      manifestData: await getManifestData(
        ingredient.manifest,
        validationResult,
        id,
      ),
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetStore[id] = asset;

    return asset;
  }

  // Get manifest data from a manifest (either a root manifest or an ingredient manifest)
  // Any processing that is common to both ingredients or active manifests should go here
  async function getManifestData(
    manifest: Manifest | null,
    validationResult: ValidationStatusResult,
    id: string,
  ): Promise<ManifestData | null> {
    if (!manifest) {
      return null;
    }

    return {
      date: manifest.signatureInfo?.time
        ? new Date(manifest.signatureInfo.time)
        : null,
      claimGenerator: selectFormattedGenerator(manifest),
      signatureInfo: manifest.signatureInfo,
      producer: selectProducer(manifest)?.name ?? null,
      editsAndActivity: await selectEditsAndActivity(
        manifest,
        get(locale) ?? DEFAULT_LOCALE,
      ),
      socialAccounts: selectSocialAccounts(manifest),
      generativeInfo: selectGenerativeInfo(manifest),
      reviewRatings: selectReviewRatings(manifest),
      validationResult,

      // Recursively process ingredients
      children: await processIngredients(manifest.ingredients, id),
    };
  }

  async function processIngredients(
    ingredients: Ingredient[],
    id: string,
  ): Promise<string[]> {
    const ingredientIds = ingredients.map(async (ingredient, idx) => {
      const ingredientId = `${id}.${idx}`;

      await ingredientToAssetData(ingredient, ingredientId);

      return ingredientId;
    });

    return Promise.all(ingredientIds);
  }

  return {
    assetMap: assetStore,
    dispose,
  };
}
