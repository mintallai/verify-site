// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
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
import { isBurgerMenuShown, isMobileViewerShown } from '../stores';

const definitions = __breakpoints__;
const mdBreakpoint = `(max-width: ${definitions.md})`;
const lgBreakpoint = `(max-width: ${definitions.lg})`;

/**
 * Make sure we close any open hamburger menu if we increase the
 * window size to a breakpoint where the menu is hidden
 */
function handleBreakpointChange({ media, matches }) {
  if (media === mdBreakpoint && !matches && get(isBurgerMenuShown)) {
    isBurgerMenuShown.set(false);
  }
  if (media === lgBreakpoint) {
    isMobileViewerShown.set(matches);
  }
}

export function breakpoints(_node) {
  //disablinbg mobile temporarily (manifest-recovery)
  return {};
  const listenBreakpoints = [mdBreakpoint, lgBreakpoint];

  isMobileViewerShown.set(matchMedia(lgBreakpoint).matches);
  listenBreakpoints.forEach((bp) =>
    matchMedia(bp).addEventListener('change', handleBreakpointChange),
  );

  return {
    destroy() {
      listenBreakpoints.forEach((bp) =>
        matchMedia(bp).removeEventListener('change', handleBreakpointChange),
      );
    },
  };
}
