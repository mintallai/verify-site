import type { Claim, Ingredient, Asset } from '@contentauth/sdk';

export type ViewableItem = Claim | Ingredient;

export interface ITreeNode {
  id: string;
  path: string[];
  name: string;
  claim?: Claim;
  asset?: Asset;
  isExpanded?: boolean;
  children?: ITreeNode[];
}
