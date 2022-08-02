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

import { TestImageDescriptor } from '../types';

const claim: TestImageDescriptor = {
  imagePath: 'E-sig-CA.jpg',
  description: 'top-level error',
  claim: {
    data: {
      fileName: 'CA.jpg',
      badge: 'alert',
      claimStatus: 'error',

      signedBy: 'C2PA Test Signing Cert August 1, 2022 at  6:48 PM',
      signedOn: 'August 1, 2022 at  6:48 PM',
      producedWith: 'make test images 0.11.1',
      editsAndActivity: [
        {
          name: 'Color adjustments',
          label: 'Changed tone, saturation, etc.',
        },
        {
          name: 'Imported assets',
          label: 'Added images, videos, etc.',
        },
      ],
      producedBy: 'Gavin Peacock',
    },
    ingredients: [
      {
        data: {
          fileName: 'A.jpg',
        },
      },
    ],
  },
};

export default claim;
