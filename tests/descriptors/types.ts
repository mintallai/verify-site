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

import type { BadgeType } from '../../src/lib/node';

export interface TestImageDescriptor {
  imagePath: string;
  description: string;
  claim?: NestedTestClaimDescriptor;
  overviewDisabled?: boolean;
}

export interface NestedTestClaimDescriptor {
  data: TestClaimDescriptor;
  ingredients?: NestedTestClaimDescriptor[];
}

export interface TestClaimDescriptor {
  fileName: string;
  claimStatus?: 'error' | 'otgp' | 'none';
  badge?: BadgeType;
  signedBy?: string;
  signedOn?: string;
  producedWith?: string;
  isBeta?: boolean;
  isOriginalCreation?: boolean;
  editsAndActivity?: EditsAndActivityItem[];
  unknownActionsAlert?: string;
  producedBy?: string;
  socialMedia?: SocialMediaItem[];
  cryptoAddress?: CryptoAddressItem[];
}

interface EditsAndActivityItem {
  name: string;
  label: string;
}

interface SocialMediaItem {
  username: string;
  url: string;
}

interface CryptoAddressItem {
  address: string;
}
