import { Manifest } from 'c2pa';
import { selectFormattedGenerator } from '../../src/lib/sdk';

const createManifestGeneratorObject = (claimGenerator: string): Manifest =>
  ({ claimGenerator } as Manifest);

describe('parseGenerator', () => {
  it('should parse User-Agent strings correctly', () => {
    const withVersion = selectFormattedGenerator(
      createManifestGeneratorObject('Adobe_Stock/1.0.0 c2pa-rs/0.5.0'),
    );
    expect(withVersion).toEqual('Adobe Stock 1.0.0');

    const withShortVersion = selectFormattedGenerator(
      createManifestGeneratorObject('Adobe_Stock/1.2 c2pa-rs/0.5.0'),
    );
    expect(withShortVersion).toEqual('Adobe Stock 1.2');

    const withParens = selectFormattedGenerator(
      createManifestGeneratorObject(
        'Adobe_Stock/1.0.0 (plugin version 2.3.1) c2pa-rs/0.5.0 (openssl version 0.9.8)',
      ),
    );
    expect(withParens).toEqual('Adobe Stock 1.0.0');

    const withoutVersion = selectFormattedGenerator(
      createManifestGeneratorObject('Adobe_Stock c2pa-rs/0.4.2'),
    );
    expect(withoutVersion).toEqual('Adobe Stock');
  });

  it('should parse old (XMP Agent) strings correctly', () => {
    const parsed = selectFormattedGenerator(
      createManifestGeneratorObject(
        'Adobe Photoshop 23.3.1 (build 20220419.r.426 4d24a4c; mac; ContentCredentials 37f01a3)',
      ),
    );
    expect(parsed).toEqual('Adobe Photoshop 23.3.1');
  });

  it('should parse invalid strings as User-Agents', () => {
    const parsed = selectFormattedGenerator(
      createManifestGeneratorObject('C2PA Testing'),
    );
    expect(parsed).toEqual('C2PA');
  });
});
