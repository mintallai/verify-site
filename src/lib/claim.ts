import compact from 'lodash/compact';
import mapValues from 'lodash/mapValues';
import type {
  IClaimReport,
  IEnhancedClaimReport,
  IEnhancedIngredient,
  IIngredient,
  IStoreReport,
  IEnhancedStoreReport,
  ViewableItem,
  IThumbnail,
  IEnhancedAsset,
  IAsset,
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

export function thumbnailToBlobUrl(thumbnail: IThumbnail): string | null {
  if (thumbnail) {
    const buffer = Uint8Array.from(thumbnail.image);
    const blob = new Blob([buffer], { type: thumbnail.format });
    return URL.createObjectURL(blob);
  }

  return null;
}

export function getThumbnailUrlForId(
  store: IEnhancedStoreReport,
  id: string,
): string | null {
  const item = resolveId(store, id);
  if (item.type === 'claim') {
    return item.asset.thumbnailUrl;
  }
  if (item.type === 'ingredient') {
    if (item.provenance) {
      // If this has a claim, return the asset for that claim
      return getThumbnailUrlForId(store, item.provenance);
    }
    return item.thumbnailUrl;
  }
}

export function getTitle(item: ViewableItem) {
  return item.type === 'claim' ? item.asset.title : item.title;
}

function enhanceAsset(asset: IAsset, thumbnailUrls: string[]): IEnhancedAsset {
  const thumbnailUrl = thumbnailToBlobUrl(asset.thumbnail);
  thumbnailUrls.push(thumbnailUrl);

  return { ...asset, thumbnailUrl };
}

function enhanceIngredients(
  claimId: string,
  ingredients: IIngredient[],
  thumbnailUrls: string[],
): IEnhancedIngredient[] {
  return ingredients.map((ingredient, idx) => {
    const thumbnailUrl = thumbnailToBlobUrl(ingredient.thumbnail);
    thumbnailUrls.push(thumbnailUrl);

    return {
      ...ingredient,
      type: 'ingredient',
      id: `${claimId}[${idx}]`,
      thumbnailUrl,
    };
  });
}

function enhanceClaim(
  report: IStoreReport,
  claimId: string,
  thumbnailUrls: string[],
): IEnhancedClaimReport {
  const claim = report.claims[claimId];

  return {
    ...claim,
    asset: enhanceAsset(claim.asset, thumbnailUrls),
    ingredients: enhanceIngredients(claimId, claim.ingredients, thumbnailUrls),
    type: 'claim',
    id: claimId,
  };
}

/**
 * This updates the report with type hints and identifiers to make it easier to
 * reference claims and ingredients throughout the app.
 */
export function enhanceReport(report: IStoreReport): IEnhancedStoreReport {
  const thumbnailUrls: string[] = [];

  return {
    head: report.head,
    claims: mapValues(report.claims, (_, claimId) =>
      enhanceClaim(report, claimId, thumbnailUrls),
    ),
    thumbnailUrls: compact(thumbnailUrls),
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
