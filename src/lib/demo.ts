import mapValues from 'lodash/mapValues';
import { IEnhancedClaimReport } from './types';

const demoUrlRegexp = /^https?:\/\/[^\/]+\/sdk\/static\/sample-images\/SNL_\d+_\d+_\w\.jpg$/;

// This is to support the case study demo images
export function supportDemoImages(
  summary: ISummaryResponse,
  urlParams: IUrlParams,
): ISummaryResponse {
  const { source } = urlParams;
  if (demoUrlRegexp.test(source)) {
    summary.claims = mapValues(summary.claims, (claim) => {
      if (!claim.signed_on) {
        if (claim.signed_by === 'truepic') {
          claim.signed_on = '2020-11-15T14:30:56.207Z';
        } else if (claim.produced_by === 'Sara Lewkowicz') {
          claim.signed_on = '2020-11-16T15:29:10Z';
        }
      }
      // Add CAPTURE category for truepic
      if (!claim.edits) {
        claim.edits = {
          categories: [],
        };
      }
      if (isSecureCapture(claim)) {
        claim.edits.categories = [...claim.edits.categories, 'CAPTURE'];
      }
      return claim;
    });
  }
  return summary;
}

const locationRegExp = /Lat(?:itude)?:\s*(-?(?:(\d|\.)+)),\s*Long(?:itude)?:\s*(-?(?:(\d|\.)+))/i;
// Do local lookup for now
const nycBBox = [
  [40.47739894, 40.91617849],
  [-74.25909008, -73.70018092],
];

export function formatLocation(location: string): string {
  const matches = locationRegExp.exec(location);
  if (matches) {
    const [, latStr, , longStr] = matches;
    const lat = parseFloat(latStr);
    const long = parseFloat(longStr);
    if (
      lat > nycBBox[0][0] &&
      lat < nycBBox[0][1] &&
      long > nycBBox[1][0] &&
      long < nycBBox[1][1]
    ) {
      return 'New York, NY, USA';
    }
  }
  return location;
}

export function isSecureCapture(claim: IEnhancedClaimReport) {
  // FIXME: Have this return the correct info
  return false;
}
