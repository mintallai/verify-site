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
import { createSidebarLayoutPageState } from './sidebarLayoutPageState';

describe('store/sidebarLayoutPageState', () => {
  it('should default to page 0', () => {
    const store = createSidebarLayoutPageState();

    expect(get(store)).toBe(0);
  });

  it('should advance to the next page when next is called', () => {
    const store = createSidebarLayoutPageState();

    store.next();

    expect(get(store)).toBe(1);
  });

  it('should not allow page to increment beyond the max', () => {
    const store = createSidebarLayoutPageState();

    store.next();
    expect(get(store)).toBe(1);

    store.next();

    expect(get(store)).toBe(1);
  });

  it('should return to the previous page when back is called', () => {
    const store = createSidebarLayoutPageState();

    store.next();

    expect(get(store)).toBe(1);

    store.back();

    expect(get(store)).toBe(0);
  });

  it('should not allow page to decrement beyond the minimum', () => {
    const store = createSidebarLayoutPageState();

    store.back();

    expect(get(store)).toBe(0);
  });
});
