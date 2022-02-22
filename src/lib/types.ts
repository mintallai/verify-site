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

import type {
  Claim,
  Ingredient,
  Asset,
  Source,
  IError,
} from '@contentauth/sdk';

export type BadgeType = 'none' | 'info' | 'missing' | 'alert';

export interface IBadgeProps {
  badgeType: BadgeType;
  badgeHelpText: string | null;
}

export type ViewableItem = Claim | Ingredient | Source;

export interface ITreeNode {
  id: string;
  locatorString: string;
  name: string;
  claim?: Claim;
  asset?: Asset | Source;
  isExpanded?: boolean;
  errors: IError[];
  children?: ITreeNode[];
}

export enum ErrorTypes {
  ASSET_HASH = "ASSET_HASH",
  SIGNATURE = "SIGNATURE",
  UNKNOWN = "UNKNOWN",
}