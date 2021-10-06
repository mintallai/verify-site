import compact from 'lodash/fp/compact';
import { Claim, Ingredient } from './sdk';
import type { ViewableItem } from './types';
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

export function getIsOriginal(claim: Claim) {
  const noIngredients = claim.ingredients.length === 0;
  const actionAssertion = claim.findAssertion(ACTION_ASSERTION_LABEL);
  const actions = actionAssertion?.data?.actions;
  const isDelivered = actions.find((x) => x.action === DELIVERED_ACTION);
  return noIngredients && !isDelivered;
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
