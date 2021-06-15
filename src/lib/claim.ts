import type {
  IClaimReport,
  IEnhancedClaimReport,
  IEnhancedIngredient,
  IIngredient,
  IEnhancedStoreReport,
  ViewableItem,
  IThumbnail,
} from './types';

const ingredientIdRegExp = /^(\S+)\[(\d+)\]$/;

/**
 * This resolves an ID of either a claim or an ingredient so that we can identify it globally.
 * We should be able to access every claim/ingredient in one of two ways:
 *
 * - Claims should be able to be accessed by their ID, e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw`
 * - Ingredients should be able to be accessed by their ID and index, e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw[0]`
 */
export function resolveId(
  store: IEnhancedStoreReport,
  id: string,
): ViewableItem | null {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }

  const isIngredient = ingredientIdRegExp.test(id);
  if (isIngredient) {
    const [, claimId, ingredientIdx] = ingredientIdRegExp.exec(id);
    return store.claims[claimId]?.ingredients[ingredientIdx];
  }

  return store.claims[id];
}

export function thumbnailToBlob(thumbnail: IThumbnail): Blob | null {
  if (thumbnail) {
    const buffer = Uint8Array.from(thumbnail.image);
    return new Blob([buffer], { type: thumbnail.format });
  }

  return null;
}

export function getThumbnailForId(
  store: IEnhancedStoreReport,
  id: string,
): Blob | null {
  const item = resolveId(store, id);
  if (item.type === 'claim') {
    return thumbnailToBlob(item.asset.thumbnail);
  }
  if (item.type === 'ingredient') {
    if (item.provenance) {
      // If this has a claim, return the asset for that claim
      return getThumbnailForId(store, item.provenance);
    }
    return thumbnailToBlob(item.thumbnail);
  }
}

export function getTitle(item: ViewableItem) {
  return item.type === 'claim' ? item.asset.title : item.title;
}

export function enhanceIngredients(
  ingredients: IIngredient[],
  claimId: string,
): IEnhancedIngredient[] {
  return ingredients.map((ingredient, idx) => {
    return {
      ...ingredient,
      type: 'ingredient',
      id: `${claimId}[${idx}]`,
    };
  });
}

export function enhanceClaim(
  claim: IClaimReport,
  claimId: string,
): IEnhancedClaimReport {
  return {
    ...claim,
    ingredients: enhanceIngredients(claim.ingredients, claimId),
    type: 'claim',
    id: claimId,
  };
}

/**
 * Gets information for all of the claim's references (parents/ingredients). Used to list
 * information about the parents/ingredients that are part of the current claim.
 *
 * @param claim The claim data that you want to show parent/ingredient information for
 * @param assetsByIdentifier The value of `assetsByIdentifier` in the stores file
 */
export function getAssetList(
  $storeReport: IEnhancedStoreReport,
  claimId: string,
): ViewableItem[] {
  const claim = resolveId($storeReport, claimId);
  if (claim?.type === 'claim') {
    return claim.ingredients;
  }
  return [];
}

/**
 * Gets information to populate the breadcrumb bar.
 * @param $storeReport The value of `storeReport` in the stores file
 * @param $contentSourceIds The value of `contentSourceIds` in the stores file
 */
export function getBreadcrumbList(
  $storeReport: IEnhancedStoreReport,
  $contentSourceIds: string[],
): ViewableItem[] {
  return $contentSourceIds.map((id) => resolveId($storeReport, id));
}
