const mapValues = require('lodash/mapValues');

function parseDictionary(data) {
  return mapValues(data, (val) => {
    if (typeof val === 'string') {
      return val;
    }
    if (typeof val === 'object' && typeof val.__value__ === 'string') {
      return val.__value__;
    }
    if (typeof val === 'object') {
      return parseDictionary(val);
    }
    throw new Error('Unexpected JL10n dictionary object provided');
  });
}

function transformDictionaryJson(data) {
  const parsed = JSON.parse(data);
  return JSON.stringify(parseDictionary(parsed));
}

module.exports = {
  parseDictionary,
  transformDictionaryJson,
};
