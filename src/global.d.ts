declare module 'drag-drop';

declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare module 'svelte-css-vars';

declare module '*.svg';

declare var __breakpoints__;

declare interface IUrlParams {
  source: string;
  tourFlag: boolean;
  forceTourFlag: boolean;
}

declare interface IErrorIdentifierMap {
  [claimID: string]: IErrorSummary[];
}

declare interface ISourceInfo {
  name: string;
  dataUrl: string;
}
