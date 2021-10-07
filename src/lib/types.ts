import type { Claim, Ingredient, Asset } from '@contentauth/sdk';

export type BadgeType = 'none' | 'info' | 'missing';

export interface IBadgeProps {
  badgeType: BadgeType;
  badgeHelpText: string | null;
}

export type ViewableItem = Claim | Ingredient;

export interface ITreeNode {
  id: string;
  name: string;
  claim?: Claim;
  asset?: Asset;
  isExpanded?: boolean;
  children?: ITreeNode[];
}
