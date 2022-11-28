// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

declare module 'drag-drop';

declare module 'html-parse-stringify' {
  function parse(html: string): any;
  function stringify(ast: any): string;
}

declare module 'svelte-css-vars';

declare module '@intl/adobe-locales';

declare module '@contentauth/sdk/dist/*';

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

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
