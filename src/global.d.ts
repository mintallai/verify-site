declare module 'drag-drop';

declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare module 'svelte-css-vars';

declare module '@intl/adobe-locales';

declare module '@contentauth/web-components/*';
declare module '@contentauth/sdk/dist/*';

declare module '*.svg';
declare module '*.png';

declare var __breakpoints__;
declare var process;

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onthumbnail?: (event: any) => any;
  }
}

declare interface IUrlParams {
  source: string;
  tourFlag: boolean;
  forceTourFlag: boolean;
}

declare interface IErrorIdentifierMap {
  [claimID: string]: IErrorSummary[];
}
