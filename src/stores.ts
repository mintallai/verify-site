import { readable, writable, derived } from 'svelte/store';
import compact from 'lodash/compact';

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

export const assetList = derived<
  [typeof primaryAsset, typeof summary],
  Asset[]
>([primaryAsset, summary], ([$primaryAsset, $summary]) => {
  if ($summary) {
    const { claims } = $summary;
    const { ingredients, parent } = $primaryAsset;
    const parentAsset = parent
      ? ({ ...claims[parent], type: 'parent' } as IParentAsset)
      : null;
    const ingredientAssets = ingredients.map((ingredient) => {
      return {
        ...ingredient,
        type: 'ingredient',
        claim: ingredient.claim_id ? claims[ingredient.claim_id] : undefined,
      } as IIngredientAsset;
    });
    return compact([parentAsset, ...ingredientAssets]);
  }
  return null;
});
