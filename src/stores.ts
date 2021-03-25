import { readable, writable, derived, get } from 'svelte/store';
import toposort from 'toposort';
import size from 'lodash/size';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import mapValues from 'lodash/mapValues';
import { addIdentifiers, getIdentifier } from './lib/claim';
import { logVerificationErrors } from './lib/util/debug';
import { supportDemoImages } from './lib/demo';

const LEARN_MORE_URL = 'https://contentauthenticity.org/';
const FAQ_URL = 'https://contentauthenticity.org/faq';
const FAQ_VERIFY_SECTION_ID = 'block-yui_3_17_2_1_1606953206758_44130';

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
  console.debug(
    'Navigating to',
    newId,
    clearBreadcrumbs,
    get(contentSourceIds),
  );
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
  console.debug('Comparing with', id);
  secondaryId.set(id);
  if (logEvent) {
    window.newrelic?.addPageAction('compareWithId', {
      id: get(primaryId),
      comparingWith: id,
    });
  }
}

/**
 * Contains the current claim summary of the loaded asset.
 */
export const summary = writable<ISummaryResponse | null>(null, (set) => {
  return () => {};
});

/**
 * Sets the summary of the loaded asset.
 * @param data Data provided by on of the `getSummary*` toolkit functions, or `null` to clear the existing info, and show the upload screen
 */
export async function setSummary(data: ISummaryResponse | null) {
  if (data) {
    // Grab map of references, since we may need to look up a claim title from
    // refs in the case of an acquisition
    console.info('Summary data', data);
    logVerificationErrors(data);
    // @ts-ignore - For debugging
    window.summaryData = JSON.stringify(data);
    // Temporary
    data = supportDemoImages(data, get(urlParams));
    const refs = reduce(
      data.claims,
      (acc, claim) => {
        if (claim.references) {
          acc = [...acc, ...claim.references];
        }
        return acc;
      },
      [],
    );
    data.claims = mapValues(data.claims, (claim, claim_id) => ({
      ...claim,
      title:
        claim.title ||
        refs.find((x) => x.title && x.claim_id === claim_id)?.title,
      claim_id,
    }));
    summary.set(data);
    navigateToRoot();
  } else {
    summary.set(null);
  }
}

/**
 * Calculates the root claim ID (the ID of the latest claim) contained in the summary data.
 */
export const rootClaimId = derived<[typeof summary], string | null>(
  [summary],
  ([$summary]) => {
    const rootId = $summary?.root_claim_id;
    if (rootId) {
      return `claim_id:${rootId}`;
    }
    return null;
  },
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
 * Calculates a flat object with all of the claims in the manifest keyed by a universal identifier.
 * Universal identifiers (stored as the key name and under the `_id` key) are in the form of:
 *   - `claim_id:<CLAIM_ID>` for claims, e.g. `claim_id:claim_0`
 *   - `document_id:<XMP_DOCUMENT_ID>` for parents/ingredients without a claim, e.g. `document_id:xmp.did.a0b1c2d3...`
 *
 * This serves as a dictionary that we can easily and performantly look up the information on any claim by its `_id`
 * field from any context, instead of traversing a nested data structure. Since it is `derived`, it is recalculated
 * only when necessary (when the summary data changes).
 *
 * For instance:
 *
 * ```
 * {
 *   // Claim entry
 *   "claim_id:<CLAIM_ID>": { ...claimInfo },
 *   // Entry for a parent/ingredient without a claim
 *   "document_id:<XMP_DOCUMENT_ID>": { ...parentOrIngredientInfo },
 * }
 * ```
 */
export const assetsByIdentifier = derived<
  [typeof summary],
  { [identifier: string]: ViewableItem }
>([summary], ([$summary]) => {
  if ($summary) {
    const grouped = addIdentifiers($summary?.claims);
    return mapValues(grouped, ([item], _id) => {
      if (item.claim_id) {
        const claim = $summary.claims[item.claim_id];
        return {
          ...claim,
          type: 'claim',
          _id,
        } as ViewableItem;
      } else {
        const ref = omit(item, ['claim_id', 'id']);
        return {
          ...ref,
          type: 'reference',
          _id,
        } as ViewableItem;
      }
    });
  }
  return {};
});

// FIXME: This needs to work for references as well - right now only claims are working
/**
 * Performs a topographical sort on assets - orginally built to help with displaying the
 * nested claim structure.
 *
 * **NOTE:** It seems we don't currently use this.
 */
export const sortedAssets = derived<[typeof summary], ViewableItem[]>(
  [summary],
  ([$summary]) => {
    if (size($summary?.claims)) {
      const { claims } = $summary;
      const nodes = Object.keys(claims);
      const edges = reduce(
        claims,
        (acc, claim) => {
          const deps = (claim.references || [])
            .filter((ref) => !!ref.claim_id)
            .map((ref) => {
              return [claim.claim_id, ref.claim_id];
            });
          return [...acc, ...deps];
        },
        [],
      );
      const sorted = toposort.array(nodes, edges);
      return sorted.map((id) => {
        const item = claims[id];
        const _id = getIdentifier(item);
        if (item.claim_id) {
          const claim = $summary.claims[item.claim_id];
          return {
            ...claim,
            type: 'claim',
            _id,
          } as ViewableItem;
        } else {
          const ref = omit(item, ['claim_id', 'id']);
          return {
            ...ref,
            type: 'reference',
            _id,
          } as ViewableItem;
        }
      });
    } else {
      return [];
    }
  },
);

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `primaryId`.
 */
export const primaryAsset = derived<
  [typeof assetsByIdentifier, typeof primaryId],
  ViewableItem
>([assetsByIdentifier, primaryId], ([$assetsByIdentifier, $primaryId]) => {
  return $assetsByIdentifier[$primaryId];
});

/**
 * Convenience accessor for the claim/ingredient data that's linked to the `secondaryId`.
 */
export const secondaryAsset = derived<
  [typeof assetsByIdentifier, typeof secondaryId],
  ViewableItem
>([assetsByIdentifier, secondaryId], ([$assetsByIdentifier, $secondaryId]) => {
  return $assetsByIdentifier[$secondaryId];
});
