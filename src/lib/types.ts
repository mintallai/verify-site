import type { Claim, Ingredient, Asset, Source } from '@contentauth/sdk';

export type BadgeType = 'none' | 'info' | 'missing';

export interface IBadgeProps {
  badgeType: BadgeType;
  badgeHelpText: string | null;
}

export type ViewableItem = Claim | Ingredient;

export interface ITreeNode {
  id: string | Symbol;
  name: string;
  claim?: Claim;
  asset?: Asset | Source;
  isExpanded?: boolean;
  children?: ITreeNode[];
}
