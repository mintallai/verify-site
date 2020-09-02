import { readable, writable, derived } from 'svelte/store';

export const primaryAssetId = writable('');

async function fetchSummary(set: any): Promise<void> {
  const res = await fetch(`mock/data.json`);
  const data = await res.json();
  primaryAssetId.set(data.rootAsset);
  set(data);
}

export const summary = readable<ISummaryResponse | null>(null, (set) => {
  fetchSummary(set);
  return () => {};
});

export const primaryAsset = derived(
  [summary, primaryAssetId],
  ([$summary, $primaryAssetId]) => {
    return $summary && $primaryAssetId
      ? $summary.assets[$primaryAssetId]
      : null;
  },
);
