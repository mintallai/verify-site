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

import { sidebarMenuState } from '$src/features/SidebarMenu';
import { fireEvent, render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import Header from './Header.svelte';

describe('components/Header', () => {
  it('should set the menu state to true when the button is clicked', () => {
    const { getByRole } = render(Header);

    const button = getByRole('button');

    expect(get(sidebarMenuState)).toBe(false);

    fireEvent.click(button);

    expect(get(sidebarMenuState)).toBe(true);
  });
});
