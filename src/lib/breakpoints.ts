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
