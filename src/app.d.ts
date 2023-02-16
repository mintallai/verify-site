// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.

// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import type { ThumbnailEvent } from '$lib/thumbnail';

declare global {
  // https://kit.svelte.dev/docs/types#app for information about these types
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  namespace svelteHTML {
    interface HTMLAttributes {
      'on:thumbnail'?: (evt: CustomEvent<ThumbnailEvent>) => void;
    }
  }

  // @TODO: why does svelte-check require this namespace?
  namespace svelte.JSX {
    interface HTMLAttributes<T> {
      onthumbnail?: (event: any) => any;
    }
  }
}

export {};
