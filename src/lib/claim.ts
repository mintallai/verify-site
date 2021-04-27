import flow from 'lodash/fp/flow';
import flatten from 'lodash/fp/flatten';
import compact from 'lodash/fp/compact';
import map from 'lodash/fp/map';
import groupBy from 'lodash/fp/groupBy';
import values from 'lodash/fp/values';
import reduce from 'lodash/fp/reduce';

/**
 * Creates a universal identifier (usually found under the `_id` key, or the key name in `assetsByIdentifier`) that
 * allows us to both identify claims as well as parents/ingredients without a claim uniquely across the manifest.
 * This uses:
 *   - `claim_id:<CLAIM_ID>` for claims, e.g. `claim_id:claim_0`
 *   - `document_id:<XMP_DOCUMENT_ID>` for parents/ingredients without a claim, e.g. `document_id:xmp.did.a0b1c2d3...`
 * @param item The claim/reference item info to generate the ID from
 */
export function getIdentifier(item: ReferenceInfo): string {
  if ('claim_id' in item && !!item.claim_id) {
    return `claim_id:${item.claim_id}`;
  } else if ('document_id' in item) {
    return `document_id:${item.document_id}`;
  } else if ('root_claim_id' in item) {
    // ReferenceInfo can be of type IClaimSummary | IReference; if of type IClaimSummary return the identifier of the root claim
    return `claim_id:${item.root_claim_id}`;
  } else {
    console.error('No identifier found for', item);
  }
}

/**
 * Extends the ReferenceInfo data structure with its universal identifier
 * @param item Claim/parent/ingredient data structure to extend
 */
function withIdentifier(item: ReferenceInfo) {
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

/**
 * Functional pipeline that attaches universal identifiers to all claims/references in a manifest
 */
export const addIdentifiers = flow(
  values,
  reduce(claimItemReducer, []),
  flatten,
  compact,
  groupBy('id'),
);

export const getIdentifiers = flow(compact, map(getIdentifier));

/**
 * Picks data for claims/parents/ingredients by passing in the corresponding universal identifier strings
 * you want info for.
 *
 * @param $ids An array of universal identifier strings you want data for (e.g. `['claim_id:claim_2']`)
 * @param $assetsByIdentifier The value of `assetsByIdentifier` in the stores file
 */
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

/**
 * Gets information for all of the claim's references (parents/ingredients). Used to list
 * information about the parents/ingredients that are part of the current claim.
 *
 * @param claim The claim data that you want to show parent/ingredient information for
 * @param assetsByIdentifier The value of `assetsByIdentifier` in the stores file
 */
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

/**
 * Gets information to populate the breadcrumb bar.
 * @param $contentSourceIds The value of `contentSourceIds` in the stores file
 * @param assetsByIdentifier The value of `assetsByIdentifier` in the stores file
 */
export function getBreadcrumbList(
  $contentSourceIds: string[],
  assetsByIdentifier: IAssetIdentifierMap,
): ViewableItem[] {
  return assetsByIdentifier
    ? pickAssets($contentSourceIds, assetsByIdentifier)
    : [];
}
