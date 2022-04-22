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

import { readable, writable, derived, get } from 'svelte/store';
import { local } from 'store2';
import { hierarchy as d3Hierarchy, HierarchyNode } from 'd3-hierarchy';
import { ZoomTransform } from 'd3-zoom';
import type {
  SdkResult,
  Manifest,
  Ingredient,
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

/**
 * Contains the SdkResult of the loaded asset.
 */
export const provenance = writable<SdkResult | null>(null, (set) => {
  return () => {};
});

/**
 * Sets the SdkResult of the loaded asset.
 */
export async function setProvenance(result: SdkResult | null) {
  dbg('Calling setProvenance with', result);

  if (result) {
    provenance.set(result);
    overviewTransform.set(null);
    navigateToRoot();
  } else {
    dbg('No provenance found');
    provenance.set(null);
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

function hasOtgpStatus(validationStatus: any[]) {
  return validationStatus.some((err) => err.code === OTGP_ERROR_CODE);
}

function hasErrorStatus(validationStatus: any[]) {
  return (
    validationStatus.filter((err) => err.code !== OTGP_ERROR_CODE).length > 0
  );
}

function parseProvenance(toolkitNode: any, loc = ROOT_LOC): TreeNode {
  const isIngredient = toolkitNode.hasOwnProperty('manifest');
  const ingredients =
    toolkitNode.manifest?.ingredients ?? toolkitNode.ingredients;
  let children = ingredients?.map((ingredient, idx) =>
    parseProvenance(ingredient, `${loc}.${idx}`),
  );
  if (isIngredient) {
    const manifest = toolkitNode.manifest;
    const statuses = toolkitNode.data.ingredient.validationStatus ?? [];
    const isOtgp = hasOtgpStatus(statuses);
    if (isOtgp) {
      children = manifest ? [parseProvenance(manifest, `${loc}.0`)] : [];
    }
    return {
      loc,
      type: 'ingredient',
      title: toolkitNode.title,
      format: toolkitNode.thumbnail.format,
      thumbnail: toolkitNode.thumbnail,
      node: toolkitNode,
      statuses,
      isOtgp,
      hasError: hasErrorStatus(statuses),
      children,
    };
  } else {
    // ID for root node (active manifest) should be `0`
    // unless there is a top-level error, where it is `0.0` (since `source` is `0`)
    const errors = toolkitNode.errors;
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

export const validationErrors = derived<[typeof provenance], any[]>(
  [provenance],
  ([$provenance]) => {
    return $provenance?.manifestStore?.activeManifest.errors ?? [];
  },
);

export const hierarchy = derived<
  [typeof provenance, typeof validationErrors],
  HierarchyTreeNode | null
>([provenance, validationErrors], ([$provenance, $validationErrors]) => {
  if ($provenance) {
    const { source, manifestStore } = $provenance;
    const activeManifest = manifestStore?.activeManifest;
    // We have a normal manifest structure and no top-level errors
    if (activeManifest) {
      return d3Hierarchy(parseProvenance(activeManifest));
    }
    // We have top-level errors or no metadata on this image
    // Show the source as the root node and manifests underneath
    if (source && !activeManifest) {
      return d3Hierarchy({
        loc: ROOT_LOC,
        type: 'source',
        node: source,
        title: source.metadata.filename,
        thumbnail: source.thumbnail,
        format: source.type,
        isOtgp: false,
        hasError: false,
        children: [],
      } as SourceTreeNode);
    }
  }
  return null;
});

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
  [typeof hierarchy, typeof secondaryLoc],
  HierarchyTreeNode | undefined
>([hierarchy, secondaryLoc], ([$hierarchy, $secondaryLoc]) => {
  return $hierarchy?.find((node) => node.data.loc === $secondaryLoc);
});

export const ancestors = derived<
  [typeof primaryLoc, typeof hierarchy],
  HierarchyTreeNode[] | null
>([primaryLoc, hierarchy], ([$primaryLoc, $hierarchy]) => {
  if ($primaryLoc) {
    return $hierarchy
      ?.find((node) => node.data.loc === $primaryLoc)
      ?.ancestors();
  }
  return null;
});

export const hasContent = derived<
  [typeof provenance, typeof isLoading],
  boolean
>([provenance, isLoading], ([$provenance, $isLoading]) => {
  return !!($provenance || $isLoading);
});

export const isComparing = derived<[typeof primary, typeof secondary], boolean>(
  [primary, secondary],
  ([$primary, $secondary]) => {
    return !!($primary && $secondary);
  },
);

export const noMetadata = derived<
  [typeof provenance, typeof isLoading],
  boolean
>([provenance, isLoading], ([$provenance, $isLoading]) => {
  return !$isLoading && !$provenance?.manifestStore?.activeManifest;
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
