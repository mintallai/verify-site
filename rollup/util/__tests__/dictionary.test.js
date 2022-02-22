// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

const { parseDictionary } = require('../dictionary');

describe('i18n utils', () => {
  it('should process JL10n files correctly', () => {
    const processed = parseDictionary({
      'my.testKey1': 'myValue1',
      'my.testKey2': {
        __value__: 'myValue2',
      },
    });
    expect(processed).toMatchObject({
      'my.testKey1': 'myValue1',
      'my.testKey2': 'myValue2',
    });
  });

  it('should process nested JL10n files correctly', () => {
    const processed = parseDictionary({
      title: 'Verify',
      components: {
        'about.title': 'About',
        'about.subtitle': {
          __value__: 'More stuff',
        },
        subcomponents: {
          'section1.title': 'Producer',
          'section2.title': {
            __value__: 'Camera Information',
          },
        },
      },
    });
    expect(processed).toMatchObject({
      title: 'Verify',
      components: {
        'about.title': 'About',
        'about.subtitle': 'More stuff',
        subcomponents: {
          'section1.title': 'Producer',
          'section2.title': 'Camera Information',
        },
      },
    });
  });

  it('should throw an error if given an incorrect JL10n object', () => {
    expect(() => {
      parseDictionary({
        'my.testKey1': 'myValue1',
        'my.testKey2': {
          __value__: 'myValue2',
        },
        // @ts-ignore
        'my.testKey3': 10,
      });
    }).toThrowError();
  });
});
