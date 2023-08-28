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
  assetDataToProps as contentSummaryAssetDataToProps,
  type ContentSummarySectionProps,
} from '$src/routes/verify/components/InfoPanel/ContentSummarySection/ContentSummarySection.svelte';
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
  selectValidationStatus,
  type ValidationStatus,
  type ValidationStatusCode,
} from './selectors/validationStatus';
import type { Disposable } from './types';

/**
 * Asset data required for the verify UI.
 */
export type AssetData = {
  date: Date | null;
  hasManifest: boolean;
  id: string;
  thumbnail: string | null;
  title: string | null;
  children?: string[];
  claimGenerator?: string;
  editsAndActivity?: TranslatedDictionaryCategory[];
  generativeInfo?: GenerativeInfo;
  producer?: string;
  reviewRatings?: ReturnType<typeof selectReviewRatings>;
  signatureInfo?: Manifest['signatureInfo'];
  socialAccounts?: ReturnType<typeof selectSocialAccounts>;
  validationStatus?: ReturnType<typeof selectValidationStatus>;
} & ContentSummarySectionProps;

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
  const { hasError, hasOtgp, statusCode } = selectValidationStatus(
    manifestStore?.validationStatus ?? [],
  );

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
        date: null,
        hasManifest: !!manifestStore,
      },
    };

    // Return early if we don't have a manifestStore or have a root-level validation error
    if (!manifestStore || hasError) {
      return {
        assetMap,
        dispose,
      };
    }
  }

  const assetStore: AssetDataMap = {};

  // Start processing the provenance tree
  await manifestStoreToAssetData(manifestStore, statusCode);

  // Convert a manifest to an asset usable by the verify UI and add it to the map
  // Any processing here should be specific to keys on the root manifest
  async function manifestStoreToAssetData(
    manifestStore: ManifestStore,
    validationStatusCode: ValidationStatusCode,
  ): Promise<AssetData> {
    const { activeManifest: manifest, validationStatus } = manifestStore;

    // Attempt to use a thumbnail on the manifest if found
    let thumbnail = manifest.thumbnail?.getUrl();

    // If no thumbnail exists on the claim and we have a valid manifest,
    // we can use the source thumbnail
    if (!thumbnail && validationStatusCode === 'valid') {
      thumbnail = source.thumbnail?.getUrl();
    }

    const asset = {
      id: ROOT_ID,
      title: manifest.title,
      thumbnail: thumbnail?.url ?? null,
      ...(await getAssetDataFromManifest(manifest, validationStatus, ROOT_ID)),
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
    const asset = {
      id,
      title: ingredient.title,
      thumbnail: thumbnail?.url ?? null,
      ...(await getAssetDataFromManifest(
        ingredient.manifest,
        ingredient.validationStatus,
        id,
      )),
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetStore[id] = asset;

    return asset;
  }

  // Get asset data from a manifest (either a root manifest or an ingredient manifest)
  // Any processing that is common to both ingredients or active manifests should go here
  async function getAssetDataFromManifest(
    manifest: Manifest | null,
    validationStatus: ValidationStatus[] | null,
    id: string,
  ): Promise<Omit<AssetData, 'title' | 'thumbnail' | 'id'>> {
    if (!manifest) {
      return {
        date: null,
        hasManifest: false,
      };
    }

    const assetData = {
      date: manifest.signatureInfo?.time
        ? new Date(manifest.signatureInfo.time)
        : null,
      hasManifest: !!manifest.signatureInfo?.time,
      claimGenerator: selectFormattedGenerator(manifest),
      signatureInfo: manifest.signatureInfo,
      producer: selectProducer(manifest)?.name,
      editsAndActivity:
        (await selectEditsAndActivity(
          manifest,
          get(locale) ?? DEFAULT_LOCALE,
        )) ?? undefined,
      socialAccounts: selectSocialAccounts(manifest),
      generativeInfo: selectGenerativeInfo(manifest) ?? undefined,
      reviewRatings: selectReviewRatings(manifest),
      validationStatus: selectValidationStatus(validationStatus ?? []),
      // Recursively process ingredients
      children: await processIngredients(manifest.ingredients, id),
    };

    return {
      ...assetData,
      ...contentSummaryAssetDataToProps(assetData),
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
