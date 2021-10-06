import { readable, writable, derived, get } from 'svelte/store';
import { local } from 'store2';
import last from 'lodash/last';
import { hierarchy as d3Hierarchy, HierarchyNode } from 'd3-hierarchy';
import { ImageProvenance, Claim, Ingredient } from './lib/sdk';
import type { ViewableItem, ITreeNode } from './lib/types';
import debug from 'debug';

const dbg = debug('store');

const LEARN_MORE_URL = 'https://contentauthenticity.org/';
const FAQ_URL = 'https://contentauthenticity.org/faq';
const FAQ_VERIFY_SECTION_ID = 'block-yui_3_17_2_1_1606953206758_44130';
const STORAGE_MODE_KEY = 'compareMode';

/**
 * Syncs the URL params to the state
 *
 * This currently happens only on page load
 */
export const urlParams = readable<IUrlParams>(null, (set) => {
  const params = new URLSearchParams(window.location.search?.substr(1));
  set({
    source: params.get('source'),
    tourFlag: !!params.get('tour'),
    forceTourFlag: !!params.get('forceTour'),
  });
});

/**
 * An accessor to the "learn more" URL
 */
export const learnMoreUrl = readable<string>(LEARN_MORE_URL, () => {});

/**
 * Stores the list of universal IDs (claim/parent/ingredient) that represents
 * the source chain that the user is currently viewing. This chain is what is
 * displayed in the breadcrumb bar.
 */
export const contentSourceIds = writable<string[]>([]);

export const collapsedBranches = writable<Set<string>>(new Set());

export function toggleBranch(id: string) {
  collapsedBranches.update((prev) => {
    if (prev.has(id)) {
      prev.delete(id);
      return prev;
    }
    return prev.add(id);
  });
}

/**
 * The primary universal ID (claim/parent/ingredient) that is being shown in the
 * viewer. If a `secondaryId` is _also_ set, a comparison view shows up.
 */
export const primaryPath = writable<string[]>([]);

/**
 * The secondary universal ID (claim/parent/ingredient) that is used as the thumbnail
 * to compare with.
 */
export const secondaryId = writable<string>('');

export const isBurgerMenuShown = writable<boolean>(false);

export const isMobileViewerShown = writable<boolean>(false);

export const isCompareSelectMode = writable<boolean>(false);

export enum CompareMode {
  Split = 'SPLIT',
  Slider = 'SLIDER',
}

/**
 * Specifies the active compare mode on the comparison view
 */
export const compareMode = writable<CompareMode>(
  local.get(STORAGE_MODE_KEY) || CompareMode.Split,
);

/**
 * Sets the comparison mode
 * @param mode CompareMode
 */
export function setCompareMode(mode: CompareMode) {
  dbg('Setting compare mode to', mode);
  compareMode.set(mode);
  local.set(STORAGE_MODE_KEY, mode);
  window.newrelic?.addPageAction('setCompareMode', { compareMode: mode });
}

/**
 * Returns the FAQ URL on the contentauthenticity.org site
 * @param id The FAQ ID selector
 */
export function getFaqUrl(id: string = FAQ_VERIFY_SECTION_ID): string {
  return `${FAQ_URL}#${id}`;
}

/**
 * Navigates the view to a new claim in the manifest. Used when clicking on different content sources.
 *
 * @param path The path to navigate to
 * @param logEvent `true` to log this event in New Relic
 */
export function navigateToPath(path: string[], logEvent = true): void {
  dbg('Navigating to path', path);

  primaryPath.set(path);
  scrollTo(0, 0);
  if (logEvent) {
    window.newrelic?.addPageAction('navigateToPath', { path });
  }
}

/**
 * Launches the comparison view between the exsiting `primaryId` and the passed in `id`.
 *
 * @param id The claim ID of the claim to compare with
 * @param logEvent `true` to log this event in New Relic
 */
export function compareWithId(id: string, logEvent = true): void {
  dbg('Comparing with', id);
  secondaryId.set(id);
  scrollTo(0, 0);
  if (logEvent) {
    window.newrelic?.addPageAction('compareWithId', {
      id: get(primaryId),
      comparingWith: id,
    });
  }
}

/**
 * Contains the ImageProvenance of the loaded asset.
 */
export const provenance = writable<ImageProvenance | null>(null, (set) => {
  return () => {};
});

/**
 * Sets the ImageProvenance of the loaded asset.
 */
export async function setProvenance(result: ImageProvenance | null) {
  dbg('Calling setProvenance');

  if (result?.exists) {
    provenance.set(result);
    navigateToRoot();
  } else {
    dbg('No provenance found');
    provenance.set(null);
  }
}

/**
 * Calculates the root claim ID (the ID of the latest claim) contained in the store report.
 */
export const rootClaimId = derived<[typeof provenance], string | null>(
  [provenance],
  ([$provenance]) => $provenance?.activeClaim.id ?? null,
);

/**
 * Convenience function to navigate to the root claim
 *
 * @param logEvent `true` to log this event in New Relic
 */
export function navigateToRoot(logEvent = true): void {
  const rootId = get(rootClaimId);
  if (rootId) {
    secondaryId.set('');
    navigateToPath([rootId], logEvent);
  }
}

/**
 * The primary universal ID (claim/parent/ingredient) that is being shown in the
 * viewer. If a `secondaryId` is _also_ set, a comparison view shows up.
 */
export const primaryId = derived<[typeof primaryPath], string>(
  [primaryPath],
  ([$primaryPath]) => {
    const id = last($primaryPath) ?? '';
    console.log('got id', id);
    return id;
  },
);

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `primaryId`.
 */
export const primaryAsset = derived<
  [typeof provenance, typeof primaryId],
  ViewableItem | undefined
>([provenance, primaryId], ([$provenance, $primaryId]) => {
  console.log('$primaryId', $primaryId);
  return $provenance?.resolveId($primaryId);
});

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `secondaryId`.
 */
export const secondaryAsset = derived<
  [typeof provenance, typeof secondaryId],
  ViewableItem | undefined
>([provenance, secondaryId], ([$provenance, $secondaryId]) => {
  return $provenance?.resolveId($secondaryId);
});

function parseProvenance(node: Claim | Ingredient): ITreeNode {
  let path = [];
  let curr = node;
  while (curr) {
    path.push(curr.id);
    curr = curr.parent;
  }
  if (node instanceof Claim) {
    return {
      id: node.id,
      path,
      name: node.title,
      claim: node,
      asset: node.asset ?? undefined,
      children: node.ingredients?.map(parseProvenance),
    };
  }
  const ingredient = node as Ingredient;
  return {
    id: ingredient.id,
    path,
    name: ingredient.title,
    asset: ingredient,
    claim: ingredient.claim,
    children: ingredient.claim?.ingredients.map(parseProvenance) ?? [],
  };
}

export const hierarchy = derived<
  [typeof provenance],
  HierarchyNode<ITreeNode> | null
>([provenance], ([$provenance]) => {
  const activeClaim = $provenance?.activeClaim;
  if (activeClaim) {
    return d3Hierarchy(parseProvenance(activeClaim));
  }
  return null;
});
