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

import startsWith from 'lodash/startsWith';
import { Manifest, Ingredient } from './sdk';
import type { HierarchyTreeNode } from '../stores';
import debug from 'debug';

const dbg = debug('claim');

export type BadgeType = 'none' | 'info' | 'missing' | 'alert';

export interface BadgeProps {
  badgeType: BadgeType;
  badgeHelpText: string | null;
}

export enum ErrorTypes {
  ASSET_HASH = 'assertion.dataHash.mismatch',
}

export enum ClaimError {
  InvalidActionAssertion = 'INVALID_ACTION_ASSERTION',
  InvalidIdentityAssertion = 'INVALID_IDENTITY_ASSERTION',
}

export function getManifest(node: HierarchyTreeNode): Manifest | null {
  return node?.data?.type === 'manifest'
    ? node.data.node
    : node?.data?.type === 'ingredient'
    ? node.data.node.manifest
    : null;
}

export function getFilename(node: HierarchyTreeNode): string {
  return node?.data?.title ?? '';
}

export function getThumbnail(node: HierarchyTreeNode) {
  // FIXME: Needs to work for source
  return node?.data.node.thumbnail;
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

export function getIngredientErrors(node: HierarchyTreeNode) {
  if (node.data.type === 'ingredient') {
    return node.data.node.data.ingredient.validationStatus ?? [];
  }
  return [];
}

export function isOTGP(node: HierarchyTreeNode) {
  return !!getIngredientErrors(node).filter((err) => err.code === ErrorTypes.ASSET_HASH)
    .length;
}

export function isAncestorOf(path: string, loc: string) {
  return startsWith(`${path}.`, `${loc}.`);
}

/**
 * Generates the badge props (used by the `cai-thumbnail`) from the claim data
 */
export function getBadgeProps(node: HierarchyTreeNode): BadgeProps {
  // FIXME: Update errors to come from validation errors
  const errors = [
    ...getIngredientErrors(node)
  ];
  // Change to accomdate different types of errors + multiple errors on a single asset
  if (errors?.length > 0) {
    switch (errors[0].code) {
      case ErrorTypes.ASSET_HASH:
        return {
          badgeType: 'missing',
          badgeHelpText: 'comp.asset.badgeMissing.helpText',
        };
      // case ErrorTypes.SIGNATURE:
      //   return {
      //     badgeType: 'alert',
      //     badgeHelpText: 'comp.asset.badgeError.helpText',
      //   };
      // case ErrorTypes.UNKNOWN:
      //   if (errors[0]?.description?.includes('smart object')) {
      //     break;
      //   }
      //   return {
      //     badgeType: 'alert',
      //     badgeHelpText: 'comp.asset.badgeError.helpText',
      //   };
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
