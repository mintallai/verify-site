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
import { Manifest } from './sdk';
import type { HierarchyTreeNode } from '../stores';

export type BadgeType = 'none' | 'info' | 'missing' | 'alert';

export interface BadgeProps {
  badgeType: BadgeType;
  badgeHelpText: string | null;
}

export function getManifest(node: HierarchyTreeNode) {
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

export function isAncestorOf(path: string, loc: string) {
  return startsWith(`${path}.`, `${loc}.`);
}

/**
 * Generates the badge props (used by the `cai-thumbnail`) from the claim data
 */
export function getBadgeProps(node: HierarchyTreeNode): BadgeProps {
  if (node.data.hasError) {
    return {
      badgeType: 'alert',
      badgeHelpText: 'comp.asset.badgeError.helpText',
    };
  } else if (node.data.isOtgp) {
    return {
      badgeType: 'missing',
      badgeHelpText: 'comp.asset.badgeMissing.helpText',
    };
  } else if (getManifest(node)) {
    return {
      badgeType: 'info',
      badgeHelpText: 'comp.asset.badgeInfo.helpText',
    };
  }
}
