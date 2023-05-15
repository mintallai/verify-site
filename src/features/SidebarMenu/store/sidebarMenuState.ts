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

export function createSidebarMenuState() {
  const { subscribe, set, update } = writable(false);

  return {
    subscribe,
    toggle: () => update((value) => !value),
    setOpen: () => set(true),
    setClosed: () => {
      set(false);
    },
  };
}

export const sidebarMenuState = createSidebarMenuState();
