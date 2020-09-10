import flow from 'lodash/fp/flow';
import flatten from 'lodash/fp/flatten';
import compact from 'lodash/fp/compact';
import map from 'lodash/fp/map';
import groupBy from 'lodash/fp/groupBy';
import values from 'lodash/fp/values';
import reduce from 'lodash/fp/reduce';

export function getIdentifier(item: ViewableItem): string {
  if ('claim_id' in item) {
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
    ...(claim.ingredients ?? []).map(withIdentifier),
    claim.parent && withIdentifier(claim.parent),
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
