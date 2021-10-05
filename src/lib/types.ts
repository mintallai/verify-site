import type { Claim, Ingredient } from '@contentauth/sdk';
// Global types
// TODO: Move to @contentauth/types when this is validated

type ValidFormats = 'image/jpeg' | 'image/png';

/**
 * This is based on the [Schema.org `Review` type](https://schema.org/Review).
 */
export interface IIngredientReview {
  claimReviewed: string;
  reviewAspect: string | null | undefined;
  /**
   * If the ingredient asset has a claim, then it's dcterms:provenance (which is the reference to the ingredient's
   * claim signature) shall be copied into a ingredient's data with the same name and value. Prior to copying, it is
   * recommended that, if it is technically able to, the processor validate the hashes provided in the claim and
   * provide a review of them, based on the Review schema. The most important aspect will be the reviewRating which
   * is either 1 (did not validate) or 5 (successfully validated). At this time, no other values are permitted.
   */
  reviewRating: 1 | 5;
}

export interface IThumbnail {
  format: ValidFormats;
  image: number[];
}

export interface IAsset {
  /**
   * A human readable title, generally source filename
   */
  title: string;
  /**
   * The format of the source file as a mime type or extension
   */
  format: string;
  /**
   * Document ID from `xmpMM:DocumentID` in XMP metadata
   */
  document_id: string;
  /**
   * Instance ID from `xmpMM:InstanceID` in XMP metadata
   */
  instance_id: string;
  /**
   * Binary thumbnail of the image
   */
  thumbnail: IThumbnail | null | undefined;
  /**
   * Reviews on the CAI data
   */
  reviews: IIngredientReview[] | null | undefined;
}

export interface IIngredient extends IAsset {
  /**
   * If this ingredient has a claim, this holds the reference to the claim info
   */
  provenance: string | null | undefined;
  /**
   * `true` if this is a parent asset
   */
  is_parent: boolean | null | undefined;
}

export interface IAssertion {
  /**
   * Label for the assertion (i.e. cai.identity.v1)
   */
  label: string;
  /**
   * Any value in JSON format (must match format for known assertions)
   */
  data: any;
}

export interface ISignature {
  issuer: string;
  time: string;
}

export interface IClaimReport {
  assertions: IAssertion[];
  asset: IAsset;
  ingredients: IIngredient[];
  /**
   * A string, compatible with XMP's `stEvt:softwareAgent`, for including the name and version of the claims recorder
   * that created the claim.
   */
  recorder: string;
  signature: ISignature;
  /**
   * Domain name type organization identifier (i.e. `adobe`)
   */
  vendor: string;
}

export interface IStoreReport {
  claims: {
    [claimID: string]: IClaimReport;
  };
  head: string;
}

export interface IStoreReportResult {
  source: 'file' | 'url';
  storeReport: IStoreReport | false;
  file?: File;
  url?: string;
  filename: string;
  data: Blob;
}

// Types for Verify
export interface IEnhancedAsset extends IAsset {
  thumbnailUrl: string | null;
}

export interface IEnhancedIngredient extends IIngredient {
  type: 'ingredient';
  id: string;
  thumbnailUrl: string | null;
}

export interface IDictionaryCategory {
  icon: string;
  labels: {
    [locale: string]: string;
  };
  descriptions: {
    [locale: string]: string;
  };
}

export interface IDictionaryAction {
  labels: {
    [isoLangCode: string]: string;
  };
  category: string;
}

export interface IDictionary {
  categories: {
    [categoryId: string]: IDictionaryCategory;
  };
  actions: {
    [actionId: string]: IDictionaryAction;
  };
}

export interface IEditCategory {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export interface IEnhancedClaimReport extends IClaimReport {
  type: 'claim';
  id: string;
  asset: IEnhancedAsset;
  ingredients: IEnhancedIngredient[];
  dictionary: IDictionary;
}

export interface IEnhancedStoreReport extends IStoreReport {
  claims: {
    [claimID: string]: IEnhancedClaimReport;
  };
  thumbnailUrls: string[];
}

export type ViewableItem = Claim | Ingredient;
