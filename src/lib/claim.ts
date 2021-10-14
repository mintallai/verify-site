import { HierarchyNode } from 'd3-hierarchy';
import { Claim, Ingredient } from './sdk';
import type { IBadgeProps, ITreeNode, ViewableItem } from './types';
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
  const isDelivered = actions?.find((x) => x.action === DELIVERED_ACTION);
  return noIngredients && !isDelivered;
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

/**
 * Generates the badge props (used by the `cai-thumbnail`) from the claim data
 */
export function getBadgeProps({ claim, errors }: IBadgePropsInput): IBadgeProps {
  // Change to accomdate different types of errors
  if (errors?.length > 0) {
    return {
      badgeType: 'missing',
      badgeHelpText: 'comp.asset.badgeMissing.HelpText',
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
