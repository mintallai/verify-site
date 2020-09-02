declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare interface IEditSummary {
  categories: string[];
  tool_usage: { [toolName: string]: number };
  special_filters: string[];
}

declare interface IIngredient {
  title: string;
  document_id: string;
  thumbnail_url: string;
  claim_id: string | null;
}

declare interface IClaimSummary {
  thumbnail_url: string;
  contributor: string;
  verified_by: string;
  created_with: string;
  date_created: string;
  edits: IEditSummary;
  parent?: string;
  ingredients?: IIngredient[];
}

declare interface ISummaryResponse {
  root_claim_id: string;
  claims: { [claimID: string]: IClaimSummary };
}
