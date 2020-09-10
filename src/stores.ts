import { readable, writable, derived, get } from 'svelte/store';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import { addIdentifiers, getIdentifiers } from './lib/claim';

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
  return $assetsByIdentifier[$primaryId];
});

function pickAssets(
  $ids: string[],
  $assetsByIdentifier: { [identifier: string]: ViewableItem },
): ViewableItem[] {
  return $ids.reduce((acc, id) => {
    const asset = $assetsByIdentifier[id];
    if (asset) {
      acc.push(asset);
    }
    return acc;
  }, []);
}

export const assetList = derived<
  [typeof primaryAsset, typeof assetsByIdentifier],
  ViewableItem[]
>(
  [primaryAsset, assetsByIdentifier],
  ([$primaryAsset, $assetsByIdentifier]) => {
    if ($assetsByIdentifier && $primaryAsset?.type === 'claim') {
      console.time('assetList');
      const ids = getIdentifiers([
        $primaryAsset.parent,
        ...($primaryAsset.ingredients ?? []),
      ]);
      const assets = pickAssets(ids, $assetsByIdentifier);
      console.timeEnd('assetList');
      return assets;
    }
    return [];
  },
);

export const breadcrumbList = derived<
  [typeof breadcrumbIds, typeof assetsByIdentifier],
  ViewableItem[]
>(
  [breadcrumbIds, assetsByIdentifier],
  ([$breadcrumbIds, $assetsByIdentifier]) => {
    return $assetsByIdentifier
      ? pickAssets($breadcrumbIds, $assetsByIdentifier)
      : [];
  },
);
