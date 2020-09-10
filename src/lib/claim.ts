import flow from 'lodash/fp/flow';
import flatten from 'lodash/fp/flatten';
import compact from 'lodash/fp/compact';
import groupBy from 'lodash/fp/groupBy';
import values from 'lodash/fp/values';
import reduce from 'lodash/fp/reduce';

export function getIdentifier(item: ViewableItem): string {
  if (item.claim_id) {
    return `claim_id:${item.claim_id}`;
  } else if (item.document_id) {
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

export function isClaimSummary(item: ViewableItem): item is IClaimSummary {
  return !!(item as IClaimSummary).claim_id;
}
