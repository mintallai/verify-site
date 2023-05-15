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

import { fireEvent, render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import SidebarMenu from './SidebarMenu.svelte';
import { sidebarMenuState } from './store/sidebarMenuState';

describe('components/SidebarMenu', () => {
  it('should set the menu state to false when a MenuItem is clicked', async () => {
    const { getByText } = render(SidebarMenu);

    sidebarMenuState.setOpen();
    expect(get(sidebarMenuState)).toBe(true);

    const button = getByText('menu.home');

    fireEvent.click(button);

    expect(get(sidebarMenuState)).toBe(false);
  });
});
