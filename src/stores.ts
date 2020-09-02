import { readable, writable, derived } from 'svelte/store';

export const primaryClaimId = writable('');

async function fetchSummary(set: any): Promise<void> {
  const res = await fetch(`mock/data.json`);
  const data = (await res.json()) as ISummaryResponse;
  primaryClaimId.set(data.root_claim_id);
  set(data);
}

export const summary = readable<ISummaryResponse | null>(null, (set) => {
  fetchSummary(set);
  return () => {};
});

export const primaryAsset = derived(
  [summary, primaryClaimId],
  ([$summary, $primaryClaimId]) => {
    return $summary && $primaryClaimId
      ? $summary.claims[$primaryClaimId]
      : null;
  },
);
