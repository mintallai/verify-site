import { parseDictionary } from '../dictionary';

describe('i18n utils', () => {
  it('should process J10n files correctly', () => {
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

  it('should process nested J10n files correctly', () => {
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

  it('should throw an error if given an incorrect J10n object', () => {
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
