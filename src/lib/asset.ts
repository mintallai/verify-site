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
  selectProducer,
  selectSocialAccounts,
  type C2paReadResult,
  type Ingredient,
  type Manifest,
  type Thumbnail,
  type TranslatedDictionaryCategory,
} from 'c2pa';
import { locale } from 'svelte-i18n';
import { get } from 'svelte/store';
import { DEFAULT_LOCALE } from './i18n';

/**
 * Asset data required for the verify UI.
 */
export interface AssetData {
  title: string;
  thumbnail: Thumbnail | null;
  id: string;
  editsAndActivity?: TranslatedDictionaryCategory[];
  socialAccounts?: ReturnType<typeof selectSocialAccounts>;
  producer?: string;
  children?: string[];
}

export type AssetDataMap = Record<string, AssetData>;

export const ROOT_ID = '0';

/**
 *
 * @param result Result from C2PA SDK
 * @returns Flattened map of asset data, keyed by asset ID
 */
export async function resultToAssetMap({
  manifestStore,
  source,
}: C2paReadResult): Promise<AssetDataMap> {
  if (!manifestStore) {
    const id = ROOT_ID;

    return {
      [id]: {
        // @TODO filename if none present?
        id,
        title: source.metadata.filename ?? 'Untitled Asset',
        thumbnail: source.thumbnail,
      },
    };
  }

  const assetStore: AssetDataMap = {};

  await manifestToAssetData(manifestStore.activeManifest, '0');

  // Convert a manifest to an asset usable by the verify UI and add it to the map
  async function manifestToAssetData(
    manifest: Manifest,
    id: string,
  ): Promise<AssetData> {
    const asset = {
      id,
      title: manifest.title,
      thumbnail: manifest.thumbnail,
      ...(await getAssetDataFromManifest(manifest, id)),
    };

    assetStore[id] = asset;

    return asset;
  }

  // Convert an ingredient to an asset usable by the verify UI and add it to the map
  async function ingredientToAssetData(
    ingredient: Ingredient,
    id: string,
  ): Promise<AssetData> {
    const asset = {
      id,
      title: ingredient.title,
      thumbnail: ingredient.thumbnail,
      ...(await getAssetDataFromManifest(ingredient.manifest, id)),
    };

    assetStore[id] = asset;

    return asset;
  }

  // Get asset data from a manifest (either a root manifest or an ingredient manifest)
  async function getAssetDataFromManifest(
    manifest: Manifest | null,
    id: string,
  ): Promise<Omit<AssetData, 'title' | 'thumbnail' | 'id'>> {
    if (!manifest) {
      return {};
    }

    return {
      producer: selectProducer(manifest)?.name,
      editsAndActivity:
        (await selectEditsAndActivity(
          manifest,
          get(locale) ?? DEFAULT_LOCALE,
        )) ?? undefined,
      socialAccounts: selectSocialAccounts(manifest),
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

      ingredientToAssetData(ingredient, ingredientId);

      return ingredientId;
    });

    return Promise.all(ingredientIds);
  }

  return assetStore;
}
