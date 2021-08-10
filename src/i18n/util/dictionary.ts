import mapValues from 'lodash/mapValues';

interface IJL10nMetadata {
  __value__: string;
  __desc__?: string;
  __translate__?: boolean;
}

interface IJL10n {
  [id: string]: string | IJL10n | IJL10nMetadata;
}

export function parseDictionary(data: IJL10n) {
  return mapValues(data, (val) => {
    if (typeof val === 'string') {
      return val;
    }
    if (typeof val === 'object' && typeof val.__value__ === 'string') {
      return val.__value__;
    }
    if (typeof val === 'object') {
      return parseDictionary(val as IJL10n);
    }
    throw new Error('Unexpected JL10n dictionary object provided');
  });
}
