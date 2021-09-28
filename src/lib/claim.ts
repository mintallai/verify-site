import flow from 'lodash/fp/flow';
import compact from 'lodash/fp/compact';
import map from 'lodash/fp/map';
import uniqBy from 'lodash/fp/uniqBy';
import sortBy from 'lodash/fp/sortBy';
import toPairs from 'lodash/fp/toPairs';
import zipObject from 'lodash/zipObject';
import pMemoize from 'p-memoize';
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
import debug from 'debug';

const dbg = debug('claim');

const ACTION_ASSERTION_LABEL = 'c2pa.actions';
const ACTION_ID_KEY = 'parameters';
const CREATIVEWORK_ASSERTION_LABEL = 'stds.schema-org.CreativeWork';
const BETA_LABEL = 'adobe.beta';
const DICTIONARY_ASSERTION_LABEL = 'adobe.dictionary';
const DEFAULT_ICON_VARIANT = 'dark';
const UNCATEGORIZED_ID = 'UNCATEGORIZED';
const ingredientIdRegExp = /^(\S+)\[(\d+)\]$/;
export const DELIVERED_ACTION = 'adobe.delivered';

export enum ClaimError {
  InvalidActionAssertion = 'INVALID_ACTION_ASSERTION',
  InvalidIdentityAssertion = 'INVALID_IDENTITY_ASSERTION',
}

/**
 * This resolves an ID of either a claim or an ingredient so that we can identify it globally.
 * We should be able to access every claim/ingredient in one of two ways:
 *
 * - Claims should be able to be accessed by their ID, e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw`
 * - Ingredients should be able to be accessed by their associated claim ID and index,
 *   e.g. `mEiBD6JdB/na1TIxvcw9HMkbo6stDkkiNFcy8Lsp3oW5yOw[0]`
 *
 * // TODO: Make sure we update this when the new `head` structure is available
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

/**
 * Converts an IThumbnail mime-type/uint array to a blob URL so we can work with thumbnails easier
 * across the application (i.e. just feed the blob URLs directly into `img` tags)
 *
 * @param thumbnail Thumnail object from the store report data structure to convert
 */
export function thumbnailToBlobUrl(thumbnail: IThumbnail): string | null {
  if (thumbnail) {
    const buffer = Uint8Array.from(thumbnail.image);
    const blob = new Blob([buffer], { type: thumbnail.format });
    return URL.createObjectURL(blob);
  }

  return null;
}

/**
 * Gets the thumbnail URL for a particular ID. We need this function instead of always
 * using thumbnailUrl since ingredients with claims will reference the thumbnail of the claim
 * instead of storing it with the ingredient.
 *
 * // TODO: Make sure we update this when the new `head` structure is available
 */
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

interface ITranslatedDictionaryCategory {
  id: string;
  icon: string;
  label: string;
  description: string;
}

/**
 * Uses the dictionary to translate an action name into category information
 */
export function translateActionName(
  dictionary: IDictionary,
  actionId: string,
  locale: string,
): ITranslatedDictionaryCategory {
  const categoryId = dictionary.actions[actionId]?.category ?? UNCATEGORIZED_ID;
  if (categoryId === UNCATEGORIZED_ID) {
    dbg('Could not find category for actionId', actionId);
  }
  const category = dictionary.categories[categoryId];
  if (category) {
    return {
      id: categoryId,
      icon: category.icon,
      label: category.labels[locale],
      description: category.descriptions[locale],
    };
  }
  return null;
}

/**
 * Pipeline to convert categories from the dictionary into a structure suitable for the
 * edits and activity web component. This also makes sure the categories are unique and sorted.
 */
const processCategories = flow(
  compact,
  map<ITranslatedDictionaryCategory, IEditCategory>((category) => {
    return {
      ...category,
      icon: category.icon?.replace('{variant}', DEFAULT_ICON_VARIANT),
    };
  }),
  uniqBy((category) => category.id),
  sortBy((category) => category.label),
);

/**
 * Gets the list of actions from the claim's action assertion and runs them through the
 * dictionary to get information needed to render the associated categories in the
 * "Edits and activity" section.
 */
export function getCategories(
  claim: IEnhancedClaimReport,
  locale: string,
): IEditCategory[] | null {
  const { dictionary } = claim;
  const actionAssertion = claim.assertions.find(
    (x) => x.label === ACTION_ASSERTION_LABEL,
  );
  const actions = actionAssertion?.data?.actions;
  // A dictionary and actions are both available
  if (dictionary && actions) {
    let categories = processCategories(
      actions.map((action) =>
        translateActionName(dictionary, action[ACTION_ID_KEY], locale),
      ),
    );
    // TODO: Replace this with dictionary
    if (actions.length === 1 && actions[0].action === DELIVERED_ACTION) {
      categories = [
        {
          id: DELIVERED_ACTION,
          icon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='15.061'%3E%3Cg fill='%236e6e6e'%3E%3Cpath data-name='Path 1' d='M10.544 11.3h-.917a.465.465 0 0 0-.458.471v1.412H1.834v-11.3h7.335v1.412a.465.465 0 0 0 .458.471h.917A.465.465 0 0 0 11 3.295V.471A.465.465 0 0 0 10.544 0H.458A.465.465 0 0 0 0 .471V14.59a.465.465 0 0 0 .458.471h10.086A.465.465 0 0 0 11 14.59v-2.824a.465.465 0 0 0-.456-.466Z'/%3E%3Cpath data-name='Path 2' d='m15.928 7.379-3.259-3.29A.425.425 0 0 0 12.403 4a.379.379 0 0 0-.4.353v2.295h-5.5a.473.473 0 0 0-.5.441v.883a.473.473 0 0 0 .5.441h5.5v2.295a.379.379 0 0 0 .4.353.425.425 0 0 0 .264-.088l3.262-3.286a.2.2 0 0 0 0-.309Z'/%3E%3C/g%3E%3C/svg%3E`,
          label: 'Published image',
          description: 'Received and distributed image',
        },
      ];
    }
    return categories;
  }
  // Action assertion exists but no dictionary URL is in the structure
  // This would happen for images that haven't transitioned to the new
  // dictionary setup yet
  if (actionAssertion && !dictionary) {
    dbg('No dictionary found', actionAssertion);
    throw new Error(ClaimError.InvalidActionAssertion);
  }
  // No current action assertion but old ones exist
  if (!actionAssertion) {
    if (
      claim.assertions.some((x) => x.label === 'cai.actions') ||
      claim.assertions.some((x) => x.label === 'cai.actions.v1')
    ) {
      dbg('Legacy action assertions found', claim.assertions);
      throw new Error(ClaimError.InvalidActionAssertion);
    }
  }
  // No actions or dictionary (this would happen if the producer opted out of this)
  return null;
}

/**
 * Gets the title for the claim or ingredient
 */
export function getTitle(item: ViewableItem) {
  return item.type === 'claim' ? item.asset.title : item.title;
}

/**
 * Gets the producer from the identity assertion in the claim
 */
export function getProducer(claim: IEnhancedClaimReport) {
  const assertion = claim.assertions.find(
    (x) => x.label === CREATIVEWORK_ASSERTION_LABEL,
  );
  const producer = assertion?.data?.author?.find(
    (x) => !x.hasOwnProperty('@id') && Array.isArray(x.credential),
  );
  // Return the display name if we get the structure we expect
  if (producer) {
    return producer.name;
  }
  // The assertion isn't available (this would happen if the producer opted out of this)
  return null;
}

/**
 * Gets information on the software that created this claim from the `recorder` field
 */
export function getRecorder(claim: IEnhancedClaimReport) {
  try {
    const [softwareName] = claim.recorder.split('(');
    return softwareName.trim();
  } catch (err) {
    return 'Unknown';
  }
}

/**
 * Gets the entity that issued this claim
 */
export function getSignatureIssuer(claim: IEnhancedClaimReport) {
  return claim.signature?.issuer ?? null;
}

/**
 * Gets the date corresponding to the signature time
 */
export function getSignatureDate(claim: IEnhancedClaimReport) {
  return claim.signature?.time ?? null;
}

/**
 * Returns `true` if has a beta assertion
 */
export function getIsBeta(claim: IEnhancedClaimReport): boolean {
  return !!claim.assertions.find((x) => x.label === BETA_LABEL)?.data?.version;
}

/**
 * Returns the CreativeWork website if one exists
 */
export function getWebsite(claim: IEnhancedClaimReport): string | undefined {
  const site = claim.assertions.find(
    (x) => x.label === CREATIVEWORK_ASSERTION_LABEL,
  )?.data?.url;
  if (site) {
    const url = new URL(site);
    if (url.protocol === 'https:' && url.hostname === 'stock.adobe.com') {
      return site;
    }
  }
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

/**
 * Enhances the ingredients array from the claim with a unique ID (used in `resolveId`) and a
 * blob URL generated from the binary thumbnail data
 *
 * @param claimId The ID of the claim that the ingredients belong to
 * @param ingredients The ingredients array from the claim
 * @param thumbnailUrls Mutable list of URLs generated so that we can clean previous blob URLs properly
 * @returns
 */
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

/**
 * Fetches the data from the dictionary URL contained in the action assertion
 *
 * **Note:** Do not use this function directly, please use `loadDictionary`
 * so that repeated calls are cached.
 *
 * @param url The URL to fetch
 */
async function fetchDictionaryUrl(url: string): Promise<IDictionary | null> {
  dbg('Loading dictionary at url:', url);
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

const cachedFetchDictionaryUrl = pMemoize(fetchDictionaryUrl);

/**
 * Loads the dictionary data specified in the claim's action assertion. This is used
 * to translate the actions in the actions assertion to category information to be used
 * in the "Edits and activity" section.
 */
async function loadDictionary(
  claim: IClaimReport,
): Promise<IDictionary | null> {
  const dictionaryAssertion = claim.assertions.find(
    (x) => x.label === DICTIONARY_ASSERTION_LABEL,
  );
  const dictionaryUrl = dictionaryAssertion?.data?.url;
  if (dictionaryUrl) {
    return cachedFetchDictionaryUrl(dictionaryUrl);
  }
  return null;
}

/**
 * Enhances the claim from the store report with:
 * - a unique ID (used in `resolveId`)
 * - an enhanced asset structure (see `enhanceAssets`)
 * - enhanced ingredients (see `enhanceIngredients`)
 * - an associated dictionary
 *
 * @param report The store report containing the claimId
 * @param claimId The ID of the claim to process
 * @param thumbnailUrls Mutable list of URLs generated so that we can clean previous blob URLs properly
 */
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
 * This creates a version of the report with type hints and identifiers to make it easier to
 * reference claims and ingredients throughout the app.
 *
 * @param report The store report to process
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
 * Returns true if the item (can be a claim/ingredient) has an associated claim
 *
 * @param item The claim/ingredient to check
 */
export function hasClaim(item: ViewableItem) {
  return item.type === 'claim' || item.provenance;
}

/**
 * Gets the claim data associated with a ViewableItem (claim/ingredient)
 */
export function getAssociatedClaim(
  $storeReport: IEnhancedStoreReport,
  item: ViewableItem,
): IEnhancedClaimReport | null {
  if (item.type === 'claim') {
    return item;
  } else if (item.type === 'ingredient' && item.provenance) {
    return resolveId($storeReport, item.provenance) as IEnhancedClaimReport;
  }
  return null;
}

/**
 * Gets information for all of the claim's ingredients (which now includes parents as denoted
 * by the `is_parent` flag). This is used to list information about the parents/ingredients
 * that are part of the current claim.
 *
 * @param $storeReport The value of `storeReport` in the stores file
 * @param claimId The claim ID to display the parents/ingredients of
 */
export function getAssetList(
  $storeReport: IEnhancedStoreReport,
  claimId: string,
): ViewableItem[] {
  if ($storeReport) {
    const claim = resolveId($storeReport, claimId);
    if (claim?.type === 'claim') {
      return claim.ingredients;
    }
  }
  return [];
}

/**
 * Gets information to populate the breadcrumb bar, namely information of all of the
 * claims/ingredients contained in the hierarchy between the head claim and the current claim/ingredient
 * that is being viewed.
 *
 * @param $storeReport The value of `storeReport` in the stores file
 * @param $contentSourceIds The value of `contentSourceIds` in the stores file
 */
export function getBreadcrumbList(
  $storeReport: IEnhancedStoreReport,
  $contentSourceIds: string[],
): ViewableItem[] {
  return $storeReport
    ? $contentSourceIds.map((id) => resolveId($storeReport, id))
    : [];
}
