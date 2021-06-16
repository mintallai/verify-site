import flow from 'lodash/fp/flow';
import compact from 'lodash/fp/compact';
import map from 'lodash/fp/map';
import uniqBy from 'lodash/fp/uniqBy';
import sortBy from 'lodash/fp/sortBy';
import toPairs from 'lodash/fp/toPairs';
import zipObject from 'lodash/zipObject';
import pMemoize from 'p-memoize';
import { asDate } from './util/format';
import type {
  IEnhancedClaimReport,
  IEnhancedIngredient,
  IIngredient,
  IStoreReport,
  IEnhancedStoreReport,
  ViewableItem,
  IThumbnail,
  IEnhancedAsset,
  IAsset,
  IClaimReport,
  IDictionary,
  IDictionaryCategory,
  IEditCategory,
} from './types';

const ACTION_ASSERTION_LABEL = 'cai.actions';
const ACTION_ID_KEY = 'stEvt:parameters';
const IDENTITY_ASSERTION_LABEL = 'cai.identity';
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_ICON_VARIANT = 'dark';
const ingredientIdRegExp = /^(\S+)\[(\d+)\]$/;

export enum ClaimError {
  InvalidActionAssertion = 'INVALID_ACTION_ASSERTION',
  InvalidIdentityAssertion = 'INVALID_IDENTITY_ASSERTION',
}

/**
 * This resolves an ID of either a claim or an ingredient so that we can identify it globally.
 * We should be able to access every claim/ingredient in one of two ways:
 *
 * - Claims should be able to be accessed by their ID, e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw`
 * - Ingredients should be able to be accessed by their ID and index, e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw[0]`
 */
export function resolveId(
  store: IEnhancedStoreReport,
  id: string,
): ViewableItem | null {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }

  const isIngredient = ingredientIdRegExp.test(id);
  if (isIngredient) {
    const [, claimId, ingredientIdx] = ingredientIdRegExp.exec(id);
    return store.claims[claimId]?.ingredients[ingredientIdx];
  }

  return store.claims[id];
}

export function thumbnailToBlobUrl(thumbnail: IThumbnail): string | null {
  if (thumbnail) {
    const buffer = Uint8Array.from(thumbnail.image);
    const blob = new Blob([buffer], { type: thumbnail.format });
    return URL.createObjectURL(blob);
  }

  return null;
}

export function getThumbnailUrlForId(
  store: IEnhancedStoreReport,
  id: string,
): string | null {
  const item = resolveId(store, id);
  if (item.type === 'claim') {
    return item.asset.thumbnailUrl;
  }
  if (item.type === 'ingredient') {
    if (item.provenance) {
      // If this has a claim, return the asset for that claim
      return getThumbnailUrlForId(store, item.provenance);
    }
    return item.thumbnailUrl;
  }
}

interface IDictionaryCategoryWithId extends IDictionaryCategory {
  id: string;
}

export function translateActionName(
  dictionary: IDictionary,
  actionId: string,
): IDictionaryCategoryWithId {
  const categoryId = dictionary.actions[actionId]?.category ?? 'UNCATEGORIZED';
  // TODO: Use proper locale
  const category = dictionary.categories[categoryId];
  if (category) {
    return {
      ...category,
      id: categoryId,
    };
  }
  return null;
}

const processCategories = flow(
  compact,
  map<IDictionaryCategoryWithId, IEditCategory>((category) => ({
    id: category.id,
    icon: category.icon.replace('{variant}', DEFAULT_ICON_VARIANT),
    label: category.labels[DEFAULT_LOCALE],
    description: category.descriptions[DEFAULT_LOCALE],
  })),
  uniqBy((category) => category.id),
  sortBy((category) => category.label),
);

export function getCategories(claim: IEnhancedClaimReport): IEditCategory[] {
  const { dictionary } = claim;
  const actionAssertion = claim.assertions.find(
    (x) => x.label === ACTION_ASSERTION_LABEL,
  );
  const actions = actionAssertion?.data?.actions;
  if (dictionary && actions) {
    return processCategories(
      actions.map((action) =>
        translateActionName(dictionary, action[ACTION_ID_KEY]),
      ),
    );
  }

  throw new Error(ClaimError.InvalidActionAssertion);
}

/**
 * Gets the title for the claim/ingredient
 */
export function getTitle(item: ViewableItem) {
  return item.type === 'claim' ? item.asset.title : item.title;
}

export function getProducer(claim: IEnhancedClaimReport) {
  const assertion = claim.assertions.find(
    (x) => x.label === IDENTITY_ASSERTION_LABEL,
  );
  const display = assertion?.data?.display;
  if (display) {
    return display;
  }

  throw new Error(ClaimError.InvalidActionAssertion);
}

export function getRecorder(claim: IEnhancedClaimReport) {
  try {
    const [softwareName] = claim.recorder.split('(');
    return softwareName.trim();
  } catch (err) {
    return 'Unknown';
  }
}

export function getSignatureIssuer(claim: IEnhancedClaimReport) {
  return claim.signature.issuer;
}

export function getSignatureDate(claim: IEnhancedClaimReport) {
  const value = claim.signature.time;
  if (value) {
    return asDate(value);
  }
  return null;
}

/**
 * Enhances the asset returned from the toolkit with a blob URL generated from the binary thumbnail data
 *
 * @param asset The asset data to enhance
 * @param thumbnailUrls Mutable list of URLs generated so that we can clean previous blob URLs properly
 */
function enhanceAsset(asset: IAsset, thumbnailUrls: string[]): IEnhancedAsset {
  const thumbnailUrl = thumbnailToBlobUrl(asset.thumbnail);
  thumbnailUrls.push(thumbnailUrl);

  return { ...asset, thumbnailUrl };
}

function enhanceIngredients(
  claimId: string,
  ingredients: IIngredient[],
  thumbnailUrls: string[],
): IEnhancedIngredient[] {
  return ingredients.map((ingredient, idx) => {
    const thumbnailUrl = thumbnailToBlobUrl(ingredient.thumbnail);
    thumbnailUrls.push(thumbnailUrl);

    return {
      ...ingredient,
      type: 'ingredient',
      id: `${claimId}[${idx}]`,
      thumbnailUrl,
    };
  });
}

async function fetchDictionaryUrl(url: string): Promise<IDictionary | null> {
  const res = await fetch(url, {
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  });
  if (res.ok) {
    return res.json();
  }
  return null;
}

const loadDictionaryUrl = pMemoize(fetchDictionaryUrl);

async function loadDictionary(
  claim: IClaimReport,
): Promise<IDictionary | null> {
  const actionAssertion = claim.assertions.find(
    (x) => x.label === ACTION_ASSERTION_LABEL,
  );
  const dictionaryUrl = actionAssertion?.data?.dictionary;
  if (dictionaryUrl) {
    return loadDictionaryUrl(dictionaryUrl);
  }
  return null;
}

async function enhanceClaim(
  report: IStoreReport,
  claimId: string,
  thumbnailUrls: string[],
): Promise<IEnhancedClaimReport> {
  const claim = report.claims[claimId];

  return {
    ...claim,
    asset: enhanceAsset(claim.asset, thumbnailUrls),
    ingredients: enhanceIngredients(claimId, claim.ingredients, thumbnailUrls),
    type: 'claim',
    id: claimId,
    dictionary: await loadDictionary(claim),
  };
}

/**
 * This updates the report with type hints and identifiers to make it easier to
 * reference claims and ingredients throughout the app.
 */
export async function enhanceReport(
  report: IStoreReport,
): Promise<IEnhancedStoreReport> {
  const thumbnailUrls: string[] = [];
  const claimPairs = toPairs(report.claims);
  const enhancedClaimsPromises = claimPairs.map(([claimId]) =>
    enhanceClaim(report, claimId, thumbnailUrls),
  );
  const enhancedClaims = await Promise.all(enhancedClaimsPromises);
  const claimIds = claimPairs.map(([claimId]) => claimId);

  return {
    head: report.head,
    claims: zipObject(claimIds, enhancedClaims),
    thumbnailUrls: compact(thumbnailUrls),
  };
}

/**
 * Gets information for all of the claim's references (parents/ingredients). Used to list
 * information about the parents/ingredients that are part of the current claim.
 *
 * @param claim The claim data that you want to show parent/ingredient information for
 * @param assetsByIdentifier The value of `assetsByIdentifier` in the stores file
 */
export function getAssetList(
  $storeReport: IEnhancedStoreReport,
  claimId: string,
): ViewableItem[] {
  const claim = resolveId($storeReport, claimId);
  if (claim?.type === 'claim') {
    return claim.ingredients;
  }
  return [];
}

/**
 * Gets information to populate the breadcrumb bar.
 * @param $storeReport The value of `storeReport` in the stores file
 * @param $contentSourceIds The value of `contentSourceIds` in the stores file
 */
export function getBreadcrumbList(
  $storeReport: IEnhancedStoreReport,
  $contentSourceIds: string[],
): ViewableItem[] {
  return $contentSourceIds.map((id) => resolveId($storeReport, id));
}
