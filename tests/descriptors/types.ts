import { BadgeType } from '../../src/lib/types';

export interface TestImageDescriptor {
  imagePath: string;
  description: string;
  claim?: NestedTestClaimDescriptor;
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
