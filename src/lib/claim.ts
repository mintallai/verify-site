import compact from 'lodash/fp/compact';
import { Claim, Ingredient } from './sdk';
import type {
  IEnhancedClaimReport,
  IEnhancedStoreReport,
  ViewableItem,
  IThumbnail,
} from './types';
import debug from 'debug';

const dbg = debug('claim');

const ACTION_ASSERTION_LABEL = 'c2pa.actions';
const CREATIVEWORK_ASSERTION_LABEL = 'stds.schema-org.CreativeWork';
const BETA_LABEL = 'adobe.beta';
const DELIVERED_ACTION = 'adobe.delivered';
const ingredientIdRegExp = /^(\S+)\[(\d+)\]$/;

export enum ClaimError {
  InvalidActionAssertion = 'INVALID_ACTION_ASSERTION',
  InvalidIdentityAssertion = 'INVALID_IDENTITY_ASSERTION',
}

/**
 * This resolves an ID of either a claim or an ingredient so that we can identify it globally.
 * We should be able to access every claim/ingredient in one of two ways:
 *
 * - Claims should be able to be accessed by their ID, e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw`
 * - Ingredients should be able to be accessed by their associated claim ID and index,
 *   e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw[0]`
 *
 * // TODO: Make sure we update this when the new `head` structure is available
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

/**
 * Converts an IThumbnail mime-type/uint array to a blob URL so we can work with thumbnails easier
 * across the application (i.e. just feed the blob URLs directly into `img` tags)
 *
 * @param thumbnail Thumnail object from the store report data structure to convert
 */
export function thumbnailToBlobUrl(thumbnail: IThumbnail): string | null {
  if (thumbnail) {
    const buffer = Uint8Array.from(thumbnail.image);
    const blob = new Blob([buffer], { type: thumbnail.format });
    return URL.createObjectURL(blob);
  }

  return null;
}

/**
 * Gets the thumbnail URL for a particular ID. We need this function instead of always
 * using thumbnailUrl since ingredients with claims will reference the thumbnail of the claim
 * instead of storing it with the ingredient.
 *
 * // TODO: Make sure we update this when the new `head` structure is available
 */
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

export function getIsOriginal(claim: Claim) {
  const noIngredients = claim.ingredients.length === 0;
  const actionAssertion = claim.findAssertion(ACTION_ASSERTION_LABEL);
  const actions = actionAssertion?.data?.actions;
  const isDelivered = actions.find((x) => x.action === DELIVERED_ACTION);
  return noIngredients && !isDelivered;
}

/**
 * Gets the title for the claim or ingredient
 */
export function getTitle(item: ViewableItem) {
  return item.type === 'claim' ? item.asset.title : item.title;
}

/**
 * Gets the producer from the identity assertion in the claim
 */
export function getProducer(claim: IEnhancedClaimReport) {
  const assertion = claim.assertions.find(
    (x) => x.label === CREATIVEWORK_ASSERTION_LABEL,
  );
  const producer = assertion?.data?.author?.find(
    (x) => !x.hasOwnProperty('@id') && Array.isArray(x.credential),
  );
  // Return the display name if we get the structure we expect
  if (producer) {
    return producer.name;
  }
  // The assertion isn't available (this would happen if the producer opted out of this)
  return null;
}

export async function getAssetsUsed(claim: Claim) {
  const ingredients = claim.ingredients ?? [];
  const thumbnailPromises = ingredients.map((ingredient) =>
    ingredient.generateThumbnailUrl(),
  );
  const thumbnails = await Promise.all(thumbnailPromises);
  const assets = ingredients.map((ingredient, idx) => ({
    id: ingredient.id,
    claimId: ingredient.claim?.id,
    thumbnailUrl: thumbnails[idx].url,
  }));
  return {
    assets,
    disposers: compact(thumbnails.map((x) => x.dispose)),
  };
}

/**
 * Returns `true` if has a beta assertion
 */
export function getIsBeta(claim: Claim): boolean {
  return !!claim.findAssertion(BETA_LABEL)?.data?.version;
}

/**
 * Returns the CreativeWork website if one exists
 */
export function getWebsite(claim: Claim): string | undefined {
  const site = claim.findAssertion(CREATIVEWORK_ASSERTION_LABEL)?.data?.url;
  if (site) {
    const url = new URL(site);
    if (url.protocol === 'https:' && url.hostname === 'stock.adobe.com') {
      return site;
    }
  }
}

/**
 * Returns true if the item (can be a claim/ingredient) has an associated claim
 *
 * @param item The claim/ingredient to check
 */
export function hasClaim(item: ViewableItem) {
  return item.type === 'claim' || item.provenance;
}

/**
 * Gets the claim data associated with a ViewableItem (claim/ingredient)
 */
export function getAssociatedClaim(item: ViewableItem): ViewableItem | null {
  if (item instanceof Claim) {
    return item;
  } else if (item instanceof Ingredient) {
    return item.parent;
  }
  return null;
}

/**
 * Gets information for all of the claim's ingredients (which now includes parents as denoted
 * by the `is_parent` flag). This is used to list information about the parents/ingredients
 * that are part of the current claim.
 *
 * @param $storeReport The value of `storeReport` in the stores file
 * @param claimId The claim ID to display the parents/ingredients of
 */
export function getAssetList(
  $storeReport: IEnhancedStoreReport,
  claimId: string,
): ViewableItem[] {
  if ($storeReport) {
    const claim = resolveId($storeReport, claimId);
    if (claim?.type === 'claim') {
      return claim.ingredients;
    }
  }
  return [];
}

/**
 * Gets information to populate the breadcrumb bar, namely information of all of the
 * claims/ingredients contained in the hierarchy between the head claim and the current claim/ingredient
 * that is being viewed.
 *
 * @param $storeReport The value of `storeReport` in the stores file
 * @param $contentSourceIds The value of `contentSourceIds` in the stores file
 */
export function getBreadcrumbList(
  $storeReport: IEnhancedStoreReport,
  $contentSourceIds: string[],
): ViewableItem[] {
  return $storeReport
    ? $contentSourceIds.map((id) => resolveId($storeReport, id))
    : [];
}
