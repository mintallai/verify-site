import { readable, writable, derived, get } from 'svelte/store';
import toposort from 'toposort';
import size from 'lodash/size';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import mapValues from 'lodash/mapValues';
import { addIdentifiers, getIdentifier } from './lib/claim';

const LEARN_MORE_URL = 'https://contentauthenticity.org/';
const FAQ_URL =
  'https://contentauthenticity.org/faq#block-yui_3_17_2_1_1606953206758_44130';

export const learnMoreUrl = readable<string>(LEARN_MORE_URL, () => {});

export const faqUrl = readable<string>(FAQ_URL, () => {});

export const contentSourceIds = writable<string[]>([]);

export const primaryId = writable<string>('');

export const secondaryId = writable<string>('');

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

export const summary = writable<ISummaryResponse | null>(null, (set) => {
  return () => {};
});

export async function setSummary(data: ISummaryResponse) {
  // Grab map of references, since we may need to look up a claim title from
  // refs in the case of an acquisition
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
}

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

export function navigateToRoot(logEvent = true): void {
  const rootId = get(rootClaimId);
  if (rootId) {
    secondaryId.set('');
    navigateToId(rootId, true, logEvent);
  }
}

export const assetsByIdentifier = derived<
  [typeof summary],
  { [identifier: string]: ViewableItem }
>([summary], ([$summary]) => {
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
});

// FIXME: This needs to work for references as well - right now only claims are working
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

export const primaryAsset = derived<
  [typeof assetsByIdentifier, typeof primaryId],
  ViewableItem
>([assetsByIdentifier, primaryId], ([$assetsByIdentifier, $primaryId]) => {
  return $assetsByIdentifier[$primaryId];
});

export const secondaryAsset = derived<
  [typeof assetsByIdentifier, typeof secondaryId],
  ViewableItem
>([assetsByIdentifier, secondaryId], ([$assetsByIdentifier, $secondaryId]) => {
  return $assetsByIdentifier[$secondaryId];
});
