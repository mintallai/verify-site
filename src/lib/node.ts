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
import type { HierarchyTreeNode } from '../stores';

const DELIVERED_ACTION = 'adobe.delivered';
const PARENS_REGEX = /\([^\)]*\)/g;
const SPACE_VERSION_REGEX = /\s+\d+\.\d(\.\d)*\s+/;

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

export function parseGenerator(value: string): string {
  // We are stripping parenthesis so that any version matches in there don't influence the test
  const withoutParens = value.replace(PARENS_REGEX, '');
  if (SPACE_VERSION_REGEX.test(withoutParens)) {
    // Old-style (XMP Agent) string (match space + version)
    return value.split('(')[0]?.trim();
  } else {
    // User-Agent string
    const firstItem = withoutParens.split(/\s+/)?.[0] ?? '';
    const [product, version] = firstItem.split('/');
    const formattedProduct = product.replace(/_/g, ' ');
    if (version) {
      return `${formattedProduct} ${version}`;
    }
    return formattedProduct;
  }
}

export function getGenerator(node: HierarchyTreeNode): string {
  const generator = getManifest(node)?.claimGenerator?.value ?? '';
  return parseGenerator(generator);
}

export function getThumbnail(node: HierarchyTreeNode) {
  return node?.data.node.thumbnail;
}

export function getIsOriginal(node: HierarchyTreeNode) {
  const manifest = getManifest(node);
  const noIngredients = manifest.ingredients?.length === 0;
  const actions = manifest.assertions.get('c2pa.actions')?.actions;
  const isDelivered = actions?.some((x) => x.action === DELIVERED_ACTION);

  return noIngredients && !isDelivered;
}

export function getReviewRatings(node: HierarchyTreeNode) {
  const manifest = getManifest(node);
  const ingredientRatings = manifest.ingredients?.reduce((acc, ingredient) => {
    return [
      ...acc,
      // @ts-ignore
      ...(ingredient.data.ingredient.metadata?.reviewRatings ?? []),
    ];
  }, []);
  const actionRatings =
    manifest.assertions.get('c2pa.actions')?.metadata?.reviewRatings ?? [];
  const reviewRatings = [...ingredientRatings, ...actionRatings];

  return {
    hasUnknownActions: reviewRatings.some(
      (review) => review.code === 'actions.unknownActionsPerformed',
    ),
    wasPossiblyModified: reviewRatings.some(
      (review) => review.code === 'ingredient.possiblyModified',
    ),
  };
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
