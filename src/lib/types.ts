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