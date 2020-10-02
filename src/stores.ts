import { readable, writable, derived, get } from 'svelte/store';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import { addIdentifiers } from './lib/claim';

const API_BASE_URL = 'https://caiverifyservice-dev-or2.stage.cloud.adobe.io';
const API_KEY = 'caiverify';
const LOAD_DELAY = 3000;

export const contentSourceIds = writable<string[]>([]);

export const primaryId = writable<string>('');

export const secondaryId = writable<string>('');

export function navigateToId(newId: string): void {
  console.log('navigating to', newId, get(contentSourceIds));
  const currId = get(primaryId);
  contentSourceIds.update((ids) => {
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
  console.log('comparing with', id);
  secondaryId.set(id);
}

function simulateDelay() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, LOAD_DELAY);
  });
}

async function fetchSummary(set: any): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/claim/summary`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      asset_url: 'http://path/file.jpg',
    }),
  });
  await simulateDelay();
  const data = (await res.json()) as ISummaryResponse;
  data.claims = mapValues(data.claims, (claim, claim_id) => ({
    ...claim,
    claim_id,
  }));
  navigateToId(`claim_id:${data.root_claim_id}`);
  // navigateToId('claim_id:c_adbe_1/cai.claim');
  // setTimeout(() => {
  //   navigateToId(`claim_id:c_tpic_1/cai.claim`);
  // }, 1000);
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
