declare module 'drag-drop';

declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare module 'svelte-css-vars';

interface IUrlParams {
  source: string;
  tourFlag: boolean;
  forceTourFlag: boolean;
}

declare interface IEditSummary {
  categories: string[];
}

declare interface ICameraInfo {
  camera?: string;
  exposure?: string;
  focal_length?: string;
  lens?: string;
}

declare interface IStockInfo {
  license_type?: string;
  source?: string;
}

declare interface IReference {
  type: 'reference';
  title: string;
  format: string;
  document_id: string;
  thumbnail_url: string;
  claim_id: string | null;
}

declare interface IIngredientReference extends IReference {
  type: 'ingredient';
}

declare interface IParentReference extends IReference {
  type: 'parent';
}

declare interface IClaimSummary {
  type: 'claim';
  claim_id?: string;
  title: string;
  thumbnail_url: string;
  produced_by: string;
  produced_with: string;
  signed_by: string;
  signed_on: string;
  edits: IEditSummary;
  location?: string;
  camera_info?: ICameraInfo;
  stock?: IStockInfo;
  references?: IReference[];
}

declare interface IClaimMap {
  [claimID: string]: IClaimSummary;
}

declare interface ISummaryResponse {
  root_claim_id: string;
  claims: IClaimMap;
}

declare interface ISummaryResult {
  source: 'file' | 'url';
  summary: ISummaryResponse | false;
  file?: File;
  url?: string;
  arrayBuffer: ArrayBuffer;
}

declare interface IIdentifiable {
  _id: string;
}

declare type ReferenceInfo = IClaimSummary | IReference;

declare type ViewableItem = ReferenceInfo & IIdentifiable;

declare interface IAssetIdentifierMap {
  [claimID: string]: ViewableItem;
}

declare interface ISourceInfo {
  name: string;
  url: string;
}
