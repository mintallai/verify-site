import { readable, writable, derived } from 'svelte/store';
import compact from 'lodash/compact';
import mapValues from 'lodash/mapValues';
import { addIdentifiers, isClaimSummary } from './lib/claim';

export const breadcrumbIds = writable<string[]>([]);

export const primaryId = writable<string>('');

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
      return $summary.claims[item.claim_id];
    } else {
      return item;
    }
  });
});

export const primaryAsset = derived(
  [assetsByIdentifier, primaryId],
  ([$assetsByIdentifier, $primaryId]) => {
    return $assetsByIdentifier[$primaryId];
  },
);

export const assetList = derived<
  [typeof primaryAsset, typeof summary],
  Asset[]
>([primaryAsset, summary], ([$primaryAsset, $summary]) => {
  if ($summary && isClaimSummary($primaryAsset)) {
    const { claims } = $summary;
    const { ingredients, parent } = $primaryAsset;
    const parentAsset = parent
      ? ({
          ...parent,
          type: 'parent',
          claim: claims[parent.claim_id],
        } as IParentAsset)
      : null;
    const ingredientAssets = ingredients.map((ingredient) => {
      return {
        ...ingredient,
        type: 'ingredient',
        claim: claims[ingredient.claim_id],
      } as IIngredientAsset;
    });
    return compact([parentAsset, ...ingredientAssets]);
  }
  return null;
});

export const breadcrumbList = derived<
  [typeof breadcrumbIds, typeof summary],
  Asset[]
>([breadcrumbIds, summary], ([$breadcrumbIds, $summary]) => {
  if ($summary) {
    return [];
  }
  return null;
});
