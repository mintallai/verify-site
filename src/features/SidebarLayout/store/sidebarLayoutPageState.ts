// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

import { writable } from 'svelte/store';

const NUM_PAGES = 2;

export function createSidebarLayoutPageState() {
  const { subscribe, update } = writable(0);

  return {
    subscribe,
    next: () => update((value) => Math.min(NUM_PAGES - 1, value + 1)),
    back: () => update((value) => Math.max(0, value - 1)),
  };
}

export const sidebarLayoutPageState = createSidebarLayoutPageState();
