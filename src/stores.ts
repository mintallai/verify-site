import { readable, writable, derived, get } from 'svelte/store';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import { addIdentifiers } from './lib/claim';

const API_BASE_URL = 'https://caiverifyservice-dev-or2.stage.cloud.adobe.io';
// const API_BASE_URL = 'http://localhost:4000';

export const breadcrumbIds = writable<string[]>([]);

export const primaryId = writable<string>('');

export const secondaryId = writable<string>('');

export function navigateToId(id: string): void {
  console.log('navigating to', id, get(breadcrumbIds));
  const currId = get(primaryId);
  breadcrumbIds.update((ids) => {
    if (ids.includes(id)) {
      return ids.slice(0, ids.indexOf(id));
    } else if (id !== currId) {
      // Don't add the current ID if it's not changing (in the case of closing a secondary asset)
      return [...ids, currId];
    } else {
      return ids;
    }
  });
  primaryId.set(id);
}

export function compareWithId(id: string): void {
  console.log('comparing with', id);
  secondaryId.set(id);
}

async function fetchSummary(set: any): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/claim/summary`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      asset_url: 'http://path/file.jpg',
    }),
  });
  const data = (await res.json()) as ISummaryResponse;
  data.claims = mapValues(data.claims, (claim, claim_id) => ({
    ...claim,
    claim_id,
  }));
  primaryId.set(`claim_id:${data.root_claim_id}`);
  // navigateToId(`claim_id:c_tpic_1/cai.claim`);
  // secondaryId.set(`claim_id:c_adbe_5/cai.claim`);
  set(data);
}

export const summary = readable<ISummaryResponse | null>(null, (set) => {
  fetchSummary(set);
  return () => {};
});

export const assetsByIdentifier = derived<
  [typeof summary],
  { [identifier: string]: ViewableItem }
>([summary], ([$summary]) => {
  const grouped = addIdentifiers($summary?.claims);
  return mapValues(grouped, ([item]) => {
    if (item.claim_id) {
      const claim = $summary.claims[item.claim_id] ?? {};
      return { ...claim, type: 'claim' } as IClaimSummary;
    } else {
      const ref = omit(item, ['claim_id', 'id']);
      return { ...ref, type: 'reference' } as IReference;
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
