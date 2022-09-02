// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
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

import { hierarchy as d3Hierarchy, HierarchyNode } from 'd3-hierarchy';
import { ZoomTransform } from 'd3-zoom';
import local from 'store2';
import { derived, get, readable, writable } from 'svelte/store';
import type {
  Ingredient,
  Manifest,
  SdkResult,
  Source,
  Thumbnail,
} from './lib/sdk';

import debug from 'debug';

const dbg = debug('store');

const LEARN_MORE_URL = 'https://contentauthenticity.org/';
const FAQ_URL = 'https://contentauthenticity.org/faq';
const FAQ_VERIFY_SECTION_ID = 'block-yui_3_17_2_1_1606953206758_44130';
const STORAGE_MODE_KEY = 'compareMode';
const OTGP_ERROR_CODE = 'assertion.dataHash.mismatch';
export const ROOT_LOC = '0';

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

export const overviewTransform = writable<ZoomTransform | null>(null);

/**
 * The primary universal ID (claim/parent/ingredient) that is being shown in the
 * viewer. If a `secondaryLoc` is _also_ set, a comparison view shows up.
 */
export const primaryLoc = writable<string>('');

/**
 * The secondary universal ID (claim/parent/ingredient) that is used as the thumbnail
 * to compare with.
 */
export const secondaryLoc = writable<string>('');

export const btnShow = writable<boolean>(true);

export const isLoading = writable<boolean>(false);

export const isBurgerMenuShown = writable<boolean>(false);

export const isMobileViewerShown = writable<boolean>(false);

export const isCompareSelectMode = writable<boolean>(false);

// TODO: See if we can import the Dialog component props instead of repeating this
export interface Dialog {
  headlineKey: string;
  contentKey: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  open?: boolean;
}

export const dialog = writable<Dialog | null>(null);

// Holds the URL of the last source that was dragged in since we can be passing different
// source URLs from the landing page and we need to trigger it to re-process the file
export const lastUrlSource = writable<string>('');

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

export function setIsLoading(loading) {
  isLoading.set(loading);
}

/**
 * Navigates the view to a new claim in the manifest. Used when clicking on different content sources.
 *
 * @param path The path to navigate to
 * @param logEvent `true` to log this event in New Relic
 */
export function navigateTo(id: string, logEvent = true): void {
  dbg('Navigating to', id);

  primaryLoc.set(id);
  scrollTo(0, 0);
  if (logEvent) {
    window.newrelic?.addPageAction('navigateTo', { id });
  }
}

export function navigateToChild(id: string, logEvent = true): void {
  navigateTo(id, logEvent);
}

/**
 * Launches the comparison view between the exsiting `primaryLoc` and the passed in `id`.
 *
 * @param id The claim ID of the claim to compare with
 * @param logEvent `true` to log this event in New Relic
 */
export function compareWith(loc: string | null, logEvent = true): void {
  dbg('Comparing with', loc);
  secondaryLoc.set(loc);
  scrollTo(0, 0);
  if (logEvent) {
    window.newrelic?.addPageAction('compareWith', {
      id: get(primaryLoc),
      comparingWith: loc,
    });
  }
}
type ActiveAssetType = ['s'] | ['r', number];

export const activeAsset = writable<ActiveAssetType>(['s']);

/**
 * Contains the SdkResult of the loaded asset.
 */
export const sourceManifestStore = writable<SdkResult | null>(null, (set) => {
  return () => {};
});

/**
 * Contains an array of SdkResults of the returned matches
 */
export const resultsManifestStore = writable<SdkResult[]>([]);

export const NoManifestsStore = writable<boolean>(false);
/**
 * Sets the SdkResult of the loaded asset.
 */
export async function setProvenance(result: SdkResult | null) {
  dbg('Calling setProvenance with', result);

  if (result) {
    sourceManifestStore.set(result);
    overviewTransform.set(null);
    navigateToRoot();
  } else {
    dbg('No provenance found');
    sourceManifestStore.set(null);
    resultsManifestStore.set([]);
    btnShow.set(true);
  }
}

interface BaseTreeNode {
  loc: string;
  title?: string;
  format: string;
  thumbnail: Thumbnail;
  isOtgp: boolean;
  hasError: boolean;
  children?: TreeNode[];
}

interface ManifestTreeNode extends BaseTreeNode {
  type: 'manifest';
  node: Manifest;
  errors: any[];
}

interface IngredientTreeNode extends BaseTreeNode {
  type: 'ingredient';
  node: Ingredient;
  statuses: any[];
}

interface SourceTreeNode extends BaseTreeNode {
  type: 'source';
  node: Source;
}

export type TreeNode = ManifestTreeNode | IngredientTreeNode | SourceTreeNode;

export type HierarchyTreeNode = HierarchyNode<TreeNode>;

/**
 * Determines if a validation status list contains an OTGP (`assertion.dataHash.mismatch`)
 * status, and therefore, should present with an orange badge.
 *
 * @param validationStatus
 * @returns `true` if we find an OTGP status
 */
function hasOtgpStatus(validationStatus: any[] = []) {
  return validationStatus.some((err) => err.code === OTGP_ERROR_CODE);
}

/**
 * Determines if a validation status list contains an error (anything not in the Rust SDK's
 * `C2PA_STATUS_VALID_SET` list _and_ not an OTGP status) and therefore, should present with a red badge.
 *
 * @param validationStatus
 * @returns `true` if we find an error
 */
function hasErrorStatus(validationStatus: any[] = []) {
  return (
    validationStatus.filter((err) => err.code !== OTGP_ERROR_CODE).length > 0
  );
}

/**
 * This function takes the provenance structure of the toolkit and returns a
 * TreeNode that is used in our D3 hierarchy tree that serves as our main
 * reference for the data we show on the site, since this data is hierarchical,
 * which is apparent both in the overview page as well as the inspect page navigation.
 *
 * In most cases, the tree is set up like this:
 * - If we have provenance data _without_ a top-level OTGP, the root node (`0`)
 *   corresponds with the active manifest, and all leaf nodes correspond with
 *   an ingredient.
 * - If we have provenance data _with_ a top-level OTGP, the root node (`0`)
 *   is the source asset (so we can show the current state), its child (`0.0`)
 *   is the active manifest, and all leaf nodes correspond with an ingredient.
 * - If we do not have provenance data, the root node (`0`) is the source asset
 *   so the user can see what they dragged in, and is the only item in the tree.
 *
 * @param toolkitNode The provenance entity from the toolkit we are parsing
 * @param loc The locator string of the node
 * @param validationStatus The validation status array associated with manifest.
 * Only used for display of top-level errors (i.e. on the active manifest)
 * @returns TreeNode
 */
function parseProvenance(
  toolkitNode: any,
  loc = ROOT_LOC,
  validationStatus?: any[],
): TreeNode {
  // The active manifest should be at the root location (0)
  const isActiveManifest = loc === ROOT_LOC;
  const isIngredient = toolkitNode.hasOwnProperty('manifest');
  const ingredients =
    toolkitNode.manifest?.ingredients ?? toolkitNode.ingredients;
  let children = ingredients?.map((ingredient, idx) =>
    parseProvenance(ingredient, `${loc}.${idx}`),
  );
  if (isIngredient) {
    const manifest = toolkitNode.manifest;
    const statuses = toolkitNode?.validationStatus ?? [];
    const isOtgp = hasOtgpStatus(statuses);
    if (isOtgp) {
      children = manifest ? [parseProvenance(manifest, `${loc}.0`)] : [];
    }
    return {
      loc,
      type: 'ingredient',
      title: toolkitNode.title,
      format: toolkitNode.thumbnail?.format,
      thumbnail: toolkitNode.thumbnail,
      node: toolkitNode,
      statuses,
      isOtgp,
      hasError: hasErrorStatus(statuses),
      children,
    };
  } else {
    // If this is the active manifest (in a non-top-level OTGP scenario)
    // we show the errors from the active manifest here. However, if this
    // is a top-level OTGP, we do not show errors since these are shown
    // on the source (root) asset (and this would be the first child).
    const errors = isActiveManifest ? validationStatus : [];

    return {
      loc,
      type: 'manifest',
      title: toolkitNode.title,
      format: toolkitNode.format,
      thumbnail: toolkitNode.thumbnail,
      node: toolkitNode,
      errors,
      children,
      isOtgp: hasOtgpStatus(errors),
      hasError: hasErrorStatus(errors),
    };
  }
}

export const sourceHierarchy = derived<
  [typeof sourceManifestStore],
  HierarchyTreeNode | null
>([sourceManifestStore], ([$sourceManifestStore]) => {
  if ($sourceManifestStore) {
    return manifestStoreToHierarchy($sourceManifestStore);
  }
  return null;
});

function manifestStoreToHierarchy(result: SdkResult) {
  const { source, manifestStore } = result;
  const activeManifest = manifestStore?.activeManifest;
  const validationStatus = manifestStore?.validationStatus;

  const isPureOtgp =
    hasOtgpStatus(validationStatus) && !hasErrorStatus(validationStatus);
  // We have C2PA sourceManifestStore data and no top-level OTGP
  // This means we should make the hierarchy map directly to the sourceManifestStore data structure
  if (activeManifest && !isPureOtgp) {
    return d3Hierarchy(parseProvenance(activeManifest, '0', validationStatus));
  }
  /**
   * If we do not have an active manifest OR top-level OTGP, we do one of two things:
   *
   * 1. If we have OTGP at the top level, this means that the current state of the image
   *    does not necessairly match the thumbnail of the active manifest. Because
   *    of this, we need to display the source (i.e. the current state of the asset)
   *    as the parent of the provenance claim in our hierarchy, together with an OTGP badge.
   * 2. If we don't have provenance data for this asset, we only show the source and
   *    have no children underneath.
   */
  if (source && (isPureOtgp || !activeManifest)) {
    return d3Hierarchy({
      loc: ROOT_LOC,
      type: 'source',
      node: source,
      title: source.metadata.filename,
      thumbnail: source.thumbnail,
      format: source.type,
      isOtgp: hasOtgpStatus(validationStatus),
      hasError: hasErrorStatus(validationStatus),
      children: activeManifest
        ? [parseProvenance(activeManifest, `${ROOT_LOC}.0`)]
        : [],
    } as SourceTreeNode);
  }
}
/**
 * derived hierarchy for the result manifest store
 */
export const resultHierarchies = derived<
  [typeof resultsManifestStore],
  HierarchyTreeNode[]
>([resultsManifestStore], ([$resultsManifestStore]) => {
  return $resultsManifestStore.map((result) => {
    if (result) {
      return manifestStoreToHierarchy(result);
    }
    return null;
  });
});

export let hierarchy = derived(
  [sourceHierarchy, resultHierarchies, activeAsset],
  ([$sourceHierarchy, $resultHierarchies, $activeAsset]) => {
    const [type, resultNumber] = $activeAsset;
    //if the result is source
    if (type == 's') {
      return $sourceHierarchy;
    } else {
      return $resultHierarchies[resultNumber];
    }
  },
);
/**
 * Convenience accessor for the claim/ingredient data that's linked to the `primaryLoc`.
 */
export const primary = derived<
  [typeof hierarchy, typeof primaryLoc],
  HierarchyTreeNode
>([hierarchy, primaryLoc], ([$hierarchy, $primaryLoc]) => {
  return $hierarchy?.find((node) => node.data.loc === $primaryLoc);
});

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `secondaryLoc`.
 */
export const secondary = derived<
  [typeof sourceHierarchy, typeof secondaryLoc],
  HierarchyTreeNode | undefined
>([sourceHierarchy, secondaryLoc], ([$hierarchy, $secondaryLoc]) => {
  return $hierarchy?.find((node) => node.data.loc === $secondaryLoc);
});

export const ancestors = derived<
  [typeof primaryLoc, typeof sourceHierarchy],
  HierarchyTreeNode[] | null
>([primaryLoc, sourceHierarchy], ([$primaryLoc, $hierarchy]) => {
  if ($primaryLoc) {
    return $hierarchy
      ?.find((node) => node.data.loc === $primaryLoc)
      ?.ancestors();
  }
  return null;
});

export const hasContent = derived<
  [typeof sourceManifestStore, typeof isLoading],
  boolean
>([sourceManifestStore, isLoading], ([$sourceManifestStore, $isLoading]) => {
  return !!($sourceManifestStore || $isLoading);
});

export const isComparing = derived<[typeof primary, typeof secondary], boolean>(
  [primary, secondary],
  ([$primary, $secondary]) => {
    return !!($primary && $secondary);
  },
);

export const noMetadata = derived<
  [typeof sourceManifestStore, typeof isLoading],
  boolean
>([sourceManifestStore, isLoading], ([$sourceManifestStore, $isLoading]) => {
  return !$isLoading && !$sourceManifestStore?.manifestStore?.activeManifest;
});

/**
 * Convenience function to navigate to the root claim
 *
 * @param logEvent `true` to log this event in New Relic
 */
export function navigateToRoot(logEvent = true): void {
  secondaryLoc.set('');
  navigateTo(ROOT_LOC, logEvent);
}

/**
 * Store for recovered manifests
 *
 */
export const recoveredManifests = writable([]);
