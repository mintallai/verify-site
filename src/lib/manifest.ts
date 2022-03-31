// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
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

import equal from 'fast-deep-equal';
import { Manifest, Ingredient } from './sdk';
import { ErrorTypes, IBadgeProps } from './types';
import type { HierarchyTreeNode } from '../stores';
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

export function getManifest(node: HierarchyTreeNode): Manifest | null {
  return node.data.type === 'manifest'
    ? node.data.node
    : node.data.type === 'ingredient'
    ? node.data.node.manifest
    : null;
}

export function getIsOriginal(manifest: Manifest) {
  // FIXME: This should support original creations in Photoshop
  // const noIngredients = claim.ingredients.length === 0;
  // const actionAssertion = claim.findAssertion(ACTION_ASSERTION_LABEL);
  // const actions = actionAssertion?.data?.actions;
  // const isDelivered = actions?.find((x) => x.action === DELIVERED_ACTION);
  // return noIngredients && !isDelivered;
  return false;
}

export function isOTGP(node: HierarchyTreeNode) {
  return node.errors?.filter((err) => err.code === ErrorTypes.ASSET_HASH)
    .length;
}

/**
 * Gets the path of IDs from the current node to the root node (active claim)
 */
export function getPath(node: HierarchyTreeNode) {
  const path = [];
  let curr = node;
  while (curr) {
    path.unshift(curr.data.loc);
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
export function getBadgeProps(node: HierarchyTreeNode): IBadgeProps {
  // FIXME: Update errors to come from validation errors
  const errors = [];
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
  if (getManifest(node)) {
    return {
      badgeType: 'info',
      badgeHelpText: 'comp.asset.badgeInfo.helpText',
    };
  }
}

/**
 * Extracts the related claim from the item. For instance, if it is a claim,
 * it will return that claim. If it is an ingredient, it will return the claim
 * on the ingredient, if it exists.
 */
export function getRelatedClaim(item: TreeNode) {
  if (item instanceof Claim) {
    return item;
  }
  if (item instanceof Ingredient) {
    return item.claim ?? null;
  }
  return null;
}
