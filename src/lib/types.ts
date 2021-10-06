import type { Claim, Ingredient, Asset } from '@contentauth/sdk';

export type ViewableItem = Claim | Ingredient;

export interface ITreeNode {
  id: string;
  name: string;
  hasClaim: boolean;
  asset?: Asset;
  isExpanded?: boolean;
  children?: ITreeNode[];
}
