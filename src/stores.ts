import { readable, writable, derived, get } from 'svelte/store';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import mapValues from 'lodash/mapValues';
import { addIdentifiers } from './lib/claim';

const LEARN_MORE_URL = 'https://contentauthenticity.org/';
const FAQ_URL =
  'https://contentauthenticity.org/faq#block-yui_3_17_2_1_1606953206758_44130';

export const learnMoreUrl = readable<string>(LEARN_MORE_URL, () => {});

export const faqUrl = readable<string>(FAQ_URL, () => {});

export const contentSourceIds = writable<string[]>([]);

export const primaryId = writable<string>('');

export const secondaryId = writable<string>('');

export function navigateToId(newId: string, clearBreadcrumbs = false): void {
  console.debug('Navigating to', newId, get(contentSourceIds));
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
}

export function compareWithId(id: string): void {
  console.debug('Comparing with', id);
  secondaryId.set(id);
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
  console.debug('Setting summary', data);
  summary.set(data);
  navigateToId(`claim_id:${data.root_claim_id}`, true);
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
