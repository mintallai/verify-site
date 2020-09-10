import { readable, writable, derived, get } from 'svelte/store';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import { addIdentifiers } from './lib/claim';

export const breadcrumbIds = writable<string[]>([]);

export const primaryId = writable<string>('');

export function navigateToId(id: string): void {
  console.log('navigating to', id);
  breadcrumbIds.update((ids) => {
    if (ids.includes(id)) {
      return ids.slice(0, ids.indexOf(id));
    } else {
      return [...ids, get(primaryId)];
    }
  });
  primaryId.set(id);
}

async function fetchSummary(set: any): Promise<void> {
  const res = await fetch(`mock/data.json`);
  const data = (await res.json()) as ISummaryResponse;
  data.claims = mapValues(data.claims, (claim, claim_id) => ({
    ...claim,
    claim_id,
  }));
  primaryId.set(`claim_id:${data.root_claim_id}`);
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
  console.log('$assetsByIdentifier', $assetsByIdentifier);
  return $assetsByIdentifier[$primaryId];
});
