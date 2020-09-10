declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare module 'svelte-css-vars';

declare interface IEditSummary {
  original_creation?: boolean;
  categories: { [categoryName: string]: number };
  tool_usage: { [toolName: string]: number };
  special_filters: string[];
}

declare interface IReference {
  type: 'reference';
  title: string;
  document_id: string;
  thumbnail_url: string;
}

declare interface IIngredientAsset extends IReference {
  type: 'ingredient';
}

declare interface IParentAsset extends IReference {
  type: 'parent';
}

declare type Asset = IIngredientAsset | IParentAsset;

declare interface IClaimSummary {
  type: 'claim';
  claim_id: string;
  thumbnail_url: string;
  contributor: string;
  contributor_id?: string;
  verified_by: string;
  created_with: string;
  date_created: string;
  edits: IEditSummary;
  parent?: IReference;
  ingredients?: IReference[];
}

declare interface IClaimMap {
  [claimID: string]: IClaimSummary;
}

declare interface ISummaryResponse {
  root_claim_id: string;
  claims: IClaimMap;
}

declare type ViewableItem = IClaimSummary | IReference;
