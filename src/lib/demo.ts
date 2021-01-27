import mapValues from 'lodash/mapValues';

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
      if (/truepic/i.test(claim?.produced_with)) {
        claim.edits.categories = [...claim.edits.categories, 'CAPTURE'];
      }
      return claim;
    });
  }
  return summary;
}
