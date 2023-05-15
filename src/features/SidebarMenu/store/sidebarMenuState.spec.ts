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

import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { createSidebarMenuState } from './sidebarMenuState';

describe('store/sidebarMenu', () => {
  it('should default to false', () => {
    const store = createSidebarMenuState();

    expect(get(store)).toBe(false);
  });

  it('should switch state when toggle is called', () => {
    const store = createSidebarMenuState();

    store.toggle();

    expect(get(store)).toBe(true);

    store.toggle();

    expect(get(store)).toBe(false);
  });

  it('should set to true when open is called', () => {
    const store = createSidebarMenuState();

    store.setOpen();

    expect(get(store)).toBe(true);
  });

  it('should set to false when close is called', () => {
    const store = createSidebarMenuState();

    store.setClosed();

    expect(get(store)).toBe(false);
  });
});
