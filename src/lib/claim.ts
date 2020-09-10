import flow from 'lodash/fp/flow';
import flatten from 'lodash/fp/flatten';
import compact from 'lodash/fp/compact';
import map from 'lodash/fp/map';
import groupBy from 'lodash/fp/groupBy';
import values from 'lodash/fp/values';
import reduce from 'lodash/fp/reduce';

export function getIdentifier(item: ViewableItem): string {
  if ('claim_id' in item && !!item.claim_id) {
    return `claim_id:${item.claim_id}`;
  } else if ('document_id' in item) {
    return `document_id:${item.document_id}`;
  } else {
    console.error('No identifier found for', item);
  }
}

function withIdentifier(item: ViewableItem) {
  return {
    ...item,
    id: getIdentifier(item),
  };
}

function claimItemReducer(acc: any[], claim: IClaimSummary) {
  acc.push([
    withIdentifier(claim),
    ...(claim.references || []).map(withIdentifier),
  ]);
  return acc;
}

export const addIdentifiers = flow(
  values,
  reduce(claimItemReducer, []),
  flatten,
  compact,
  groupBy('id'),
);

export const getIdentifiers = flow(compact, map(getIdentifier));

function pickAssets(
  $ids: string[],
  $assetsByIdentifier: IAssetIdentifierMap,
): ViewableItem[] {
  return $ids.reduce((acc, id) => {
    const asset = $assetsByIdentifier[id];
    if (asset) {
      acc.push(asset);
    }
    return acc;
  }, []);
}

export function getAssetList(
  claim: IClaimSummary,
  assetsByIdentifier: IAssetIdentifierMap,
): ViewableItem[] {
  if (assetsByIdentifier) {
    const ids = getIdentifiers(claim.references);
    return pickAssets(ids, assetsByIdentifier);
  }
  return [];
}

export function getBreadcrumbList(
  $breadcrumbIds: string[],
  assetsByIdentifier: IAssetIdentifierMap,
): ViewableItem[] {
  return assetsByIdentifier
    ? pickAssets($breadcrumbIds, assetsByIdentifier)
    : [];
}
