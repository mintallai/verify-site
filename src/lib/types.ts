// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
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

import type { Manifest, Ingredient, Source } from './sdk';

export type BadgeType = 'none' | 'info' | 'missing' | 'alert';

export interface IBadgeProps {
  badgeType: BadgeType;
  badgeHelpText: string | null;
}

export type ViewableItem = Manifest | Ingredient | Source;

// TODO: @emensch probably has a better way of doing this with generics;
// just trying to get this working - @dkozma
export interface ITreeNode {
  id: string;
  node: Manifest | Ingredient;
  children?: ITreeNode[];
}

export enum ErrorTypes {
  ASSET_HASH = 'ASSET_HASH',
  SIGNATURE = 'SIGNATURE',
  UNKNOWN = 'UNKNOWN',
}
