import { readable, writable, derived, get } from 'svelte/store';
import { local } from 'store2';
import { enhanceReport, resolveId } from './lib/claim';
import type {
  IEnhancedStoreReport,
  IStoreReportResult,
  ViewableItem,
} from './lib/types';

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

/**
 * The primary univeral ID (claim/parent/ingredient) that is being shown in the
 * viewer. If a `secondaryId` is _also_ set, a comparison view shows up.
 */
export const primaryId = writable<string>('');

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
 * @param newId The claim ID to show in the viewer/highlight in content sources
 * @param clearBreadcrumbs `true` to clear the breadcrumbs/history
 * @param logEvent `true` to log this event in New Relic
 */
export function navigateToId(
  newId: string,
  clearBreadcrumbs = false,
  logEvent = true,
): void {
  const currId = get(primaryId);
  contentSourceIds.update((ids) => {
    if (clearBreadcrumbs) {
      return [newId];
    }
    if (ids.includes(newId)) {
      return ids.slice(0, ids.indexOf(newId) + 1);
    } else if (ids.length && newId !== currId) {
      // Don't add the current ID if it's not changing (in the case of closing a secondary asset)
      return [...ids, newId];
    } else if (!ids.length && newId) {
      // Initial load
      return [newId];
    } else {
      return ids;
    }
  });
  primaryId.set(newId);
  scrollTo(0, 0);
  if (logEvent) {
    window.newrelic?.addPageAction('navigateToId', { id: newId });
  }
}

/**
 * Launches the comparison view between the exsiting `primaryId` and the passed in `id`.
 *
 * @param id The claim ID of the claim to compare with
 * @param logEvent `true` to log this event in New Relic
 */
export function compareWithId(id: string, logEvent = true): void {
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
 * Contains info about the source file that was uploaded/dragged in
 */
export const source = writable<ISourceInfo | null>(null, (set) => {
  return () => {};
});

/**
 * Sets the information about the source of the asset that we are inspecting, whether it
 * is from the `source` URL parameter or a file that was dragged in.
 *
 * @param result The result from the `getStore*` toolkit functions
 */
async function setSource(result: IStoreReportResult) {
  const existingUrl = get(source)?.dataUrl;
  // Clean up the previous blobURL
  if (existingUrl && /^blob:/.test(existingUrl)) {
    URL.revokeObjectURL(existingUrl);
  }
  source.set({
    name: result.filename,
    dataUrl: URL.createObjectURL(result.data),
  });
}

/**
 * Contains the current store report of the loaded asset.
 */
export const storeReport = writable<IEnhancedStoreReport | null>(
  null,
  (set) => {
    return () => {};
  },
);

/**
 * Sets the store report of the loaded asset.
 *
 * @param data Data provided by on of the `getStore*` toolkit functions, or `null` to clear the
 *             existing info, and show the upload screen
 */
export async function setStoreReport(result: IStoreReportResult) {
  // Clean up existing store report
  const existingThumbnails = get(storeReport)?.thumbnailUrls ?? [];
  existingThumbnails.forEach((dataUrl) => URL.revokeObjectURL(dataUrl));

  // Set new data and set source information
  const data = result?.storeReport;
  if (result) {
    setSource(result);
  }
  if (data) {
    const enhancedReport = await enhanceReport(data);
    console.info('Store report', enhancedReport);
    // logVerificationErrors(data);
    storeReport.set(enhancedReport);
    navigateToRoot();
  } else if (data === false) {
    storeReport.set(null);
  }
}

/**
 * Calculates the root claim ID (the ID of the latest claim) contained in the store report.
 */
export const rootClaimId = derived<[typeof storeReport], string | null>(
  [storeReport],
  ([$storeReport]) => $storeReport?.head ?? null,
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
    navigateToId(rootId, true, logEvent);
  }
}

/**
 * // FIXME: Make sure we account for this
export const errorsByIdentifier = derived<
  [typeof summary],
  { [identifier: string]: IErrorIdentifierMap }
>([summary], ([$summary]) => {
  if ($summary) {
    const nestedDepth = 3; // Errors are nested references[x].errors
    const errors = reduceDeep(
      $summary,
      (acc, value, key, parent, ctx) => {
        if (key === 'errors' && value.length) {
          // head claim error
          if (ctx.depth < nestedDepth) {
            return {};
          }
          const parentClaim = ctx.parents[ctx.depth - nestedDepth].value;
          const id = getIdentifier(parentClaim);
          acc[id] ? acc[id].push(value) : (acc[id] = value);
        }
        return acc;
      },
      {},
    );
    return errors;
  }
  return {};
});
*/

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `primaryId`.
 */
export const primaryAsset = derived<
  [typeof storeReport, typeof primaryId],
  ViewableItem | null
>([storeReport, primaryId], ([$storeReport, $primaryId]) => {
  return resolveId($storeReport, $primaryId);
});

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `secondaryId`.
 */
export const secondaryAsset = derived<
  [typeof storeReport, typeof secondaryId],
  ViewableItem | null
>([storeReport, secondaryId], ([$storeReport, $secondaryId]) => {
  return resolveId($storeReport, $secondaryId);
});
