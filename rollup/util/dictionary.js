const mapValues = require('lodash/mapValues');

/**
 * Processes JL10N syntax (with metadata and nested) into key:value
 * pairs since we do not need metadata once it gets to the end user.
 *
 * @see https://wiki.corp.adobe.com/x/kYs_U
 */
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

/**
 * Transformer for rollup-plugin-copy
 */
function transformDictionaryJson(data) {
  const parsed = JSON.parse(data);
  return JSON.stringify(parseDictionary(parsed));
}

module.exports = {
  parseDictionary,
  transformDictionaryJson,
};
