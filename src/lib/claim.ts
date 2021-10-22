import equal from 'fast-deep-equal';
import { HierarchyNode } from 'd3-hierarchy';
import { Claim, Ingredient } from './sdk';
import { ErrorTypes, IBadgeProps, ITreeNode, ViewableItem } from './types';
import debug from 'debug';

const dbg = debug('claim');

const ACTION_ASSERTION_LABEL = 'c2pa.actions';
const CREATIVEWORK_ASSERTION_LABEL = 'stds.schema-org.CreativeWork';
const BETA_LABEL = 'adobe.beta';
const DELIVERED_ACTION = 'adobe.delivered';

export enum ClaimError {
  InvalidActionAssertion = 'INVALID_ACTION_ASSERTION',
  InvalidIdentityAssertion = 'INVALID_IDENTITY_ASSERTION',
}

export function getIsOriginal(claim: Claim) {
  const noIngredients = claim.ingredients.length === 0;
  const actionAssertion = claim.findAssertion(ACTION_ASSERTION_LABEL);
  const actions = actionAssertion?.data?.actions;
  const isDelivered = actions?.find((x) => x.action === DELIVERED_ACTION);
  return noIngredients && !isDelivered;
}

/**
 * TODO: make this implementation more robust
 * Issues w/ implementation:
 * Stock images look like OTGP image in terms of the data -- 
 * this is likely to be true for any smart object that brings in a claim
 * That means there's no data-based similarities to take advantage of to differentiate. 
 * The quick way is to check if it's a stock image > any images in the wild w/ similar treatment will be ignored
 * Longer way is to check if it's an OTGP image > relies on the ASSET_HASH error;
 * > smart objects specifically return an error that indicates they may have undergone changes
 * >> We don't currently account for this OTGP case, just ASSET_HASH
 */
 export function getIsIngredientWithClaim(node: Ingredient) {
  const noIngredients = node.claim?.ingredients.length === 0;
  // const isStock = node.claim?.data?.recorder.includes('Adobe Stock');
  return noIngredients && !isOTGP(node);
}

export function isOTGP(node: Claim | Ingredient) {
  return node.errors?.filter( (err) => err.code === ErrorTypes.ASSET_HASH ).length;
}


interface IBadgePropsInput {
  claim?: Claim | Ingredient;
  errors?: any[];
}

/**
 * Gets the path of IDs from the current node to the root node (active claim)
 */
export function getPath(node: HierarchyNode<ITreeNode>) {
  const path = [];
  let curr = node;
  while (curr) {
    path.unshift(curr.data.id);
    curr = curr.parent;
  }
  return path;
}

export function isInPath(pathArray: string[], nodePath: string[]) {
  return equal(nodePath, pathArray.slice(0, nodePath.length));
}

/**
 * Generates the badge props (used by the `cai-thumbnail`) from the claim data
 */
export function getBadgeProps({
  claim,
  errors,
}: IBadgePropsInput): IBadgeProps {
  // Change to accomdate different types of errors + multiple errors on a single asset
  if (errors?.length > 0) {
    switch (errors[0].code) {
      case ErrorTypes.ASSET_HASH:
        return {
          badgeType: 'missing',
          badgeHelpText: 'comp.asset.badgeMissing.helpText',
        };
      case ErrorTypes.SIGNATURE:
        return {
          badgeType: 'alert',
          badgeHelpText: 'comp.asset.badgeError.helpText',
        };
      case ErrorTypes.UNKNOWN:
        if (errors[0]?.description?.includes('smart object')) {
          break;
        }
        return {
          badgeType: 'alert',
          badgeHelpText: 'comp.asset.badgeError.helpText',
        };
      default:
        return {
          badgeType: 'alert',
          badgeHelpText: 'comp.asset.badgeError.helpText',
        };
    }
  }
  if (claim) {
    return {
      badgeType: 'info',
      badgeHelpText: 'comp.asset.badgeInfo.helpText',
    };
  }
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
 * Extracts the related claim from the item. For instance, if it is a claim,
 * it will return that claim. If it is an ingredient, it will return the claim
 * on the ingredient, if it exists.
 */
export function getRelatedClaim(item: ViewableItem) {
  if (item instanceof Claim) {
    return item;
  }
  if (item instanceof Ingredient) {
    return item.claim ?? null;
  }
  return null;
}
