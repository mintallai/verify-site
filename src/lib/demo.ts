import { IEnhancedClaimReport } from './types';

// TODO: Make this work once we have a proper secure capture setup
// @see https://app.clubhouse.io/cai/story/2962
export function isSecureCapture(claim: IEnhancedClaimReport) {
  return false;
}
