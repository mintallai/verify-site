import pMemoize from 'p-memoize';
import merge from 'lodash/merge';
import difference from 'lodash/difference';
import Ingest from '@ccx-public/ingest';
import { v4 as uuidv4 } from 'uuid';
import { getConfig, SITE_VERSION } from './config';
import debug from 'debug';

const dbg = debug('ingest');

const getIngest = pMemoize(async () => {
  const config = await getConfig();
  const dependencies = {
    getAccessToken(callback) {
      callback(null);
    },
    log(msg) {
      dbg(msg);
    },
  };
  const options = {
    ENVIRONMENT: config.env, // 'prod', 'stage', or 'dev' (default is 'prod')
    ALLOW_NO_TOKEN: true, // Optional - set to allow events to be sent without a token
    ANALYTICS_API_KEY: 'cai-verify-service', // Required
    ANALYTICS_PROJECT: 'cai-verify-service', // Required
    ANALYTICS_X_PRODUCT: `cai-verify-site/${SITE_VERSION}`, // Required
    ANALYTICS_USER_AGENT: navigator.userAgent,
    ANALYTICS_MAX_QUEUED_EVENTS: 50, // Optional - default is max queue of 50 events
    ANALYTICS_DEBOUNCE: 10, // Optional - default is to send no faster than every 10 seconds
    ANALYTICS_USER_REGION: 'UNKNOWN', // Optional - set the x-user-region header (default is 'UNKNOWN')
    ANALYTICS_INGEST_TYPE: 'dunamis', // Optional - only change this if you know what you're doing
    TIMESTAMP_PROPERTY_NAME: 'event.dts_end', // Optional - only change this if you know what you're doing (override SDM)
  };
  const ingest = new Ingest(dependencies, options);
  ingest.enable(true);

  return ingest;
});

export interface IngestPayload {
  'event.guid': string;
  'event.dts_end': Date;
  'event.workflow': string;
  'event.category': string;
  'event.subcategory': string;
  'event.type': 'render' | 'success' | 'error' | 'click';
  'event.subtype': 'page' | 'verify' | 'learn' | 'faq';
  'event.offline': boolean;
  'event.language': string;
  'event.value': number | string;
  'event.url': string;
  'event.referrer': string;
  'event.error_code': string;
  'event.error_type': string;
  'event.error_desc': string;
  'source.name': string;
  'ui.view_type': 'link' | 'upload';
}

const eventDefaults: Partial<IngestPayload> = {
  'event.workflow': 'Home',
  'event.category': 'DESKTOP',
  'event.subcategory': 'Verify',
  'source.name': 'CAI',
};

const requiredEvents = ['event.type'];

export async function postEvent(data: Partial<IngestPayload>) {
  const ingest = await getIngest();
  const common = {
    'event.guid': uuidv4(),
    'event.dts_end': new Date(),
    'event.offline': !navigator.onLine,
    'event.language': navigator.language,
    'event.url': location.href,
    'event.referrer': document.referrer,
  } as Partial<IngestPayload>;
  const payload = merge(common, eventDefaults, data) as IngestPayload;

  const missing = difference(requiredEvents, Object.keys(payload));
  if (missing.length) {
    dbg('Payload sent with missing data', { payload, missing });
    throw new Error(`Attempting to send payload with missing required data`);
  }

  ingest.postEvent(payload, (err) => {
    if (err) {
      console.warn('Error posting event to ingest', err);
    }
  });
}
