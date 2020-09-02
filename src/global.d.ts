declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare interface IEditSummary {
  categories: string[];
  toolUsage: { [toolName: string]: number };
  specialFilters: string[];
}

declare interface IAuthoringTool {
  programName: string;
  iconURL: string;
}

declare interface ISigningAuthority {
  organizationName: string;
  iconURL: string;
}

declare interface IClaimSummary {
  contributor: string;
  verifiedBy: ISigningAuthority;
  createdWith: IAuthoringTool;
  dateCreated: string;
  edits: IEditSummary;
}

declare interface IAsset {
  thumbnailURL: string;
  verification?: IClaimSummary;
}

declare interface ISummaryResponse {
  rootAsset: string;
  assets: { [id: string]: IAsset };
}
