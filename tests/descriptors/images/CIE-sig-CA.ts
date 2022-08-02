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
  imagePath: 'CIE-sig-CA.jpg',
  description: 'nested error',
  claim: {
    data: {
      fileName: 'CIE-sig-CA.jpg',
      badge: 'info',
      signedBy: 'C2PA Test Signing Cert August 1, 2022 at  6:48 PM',
      signedOn: 'August 1, 2022 at  6:48 PM',
      producedWith: 'make test images 0.11.1',
      editsAndActivity: [
        {
          name: 'Secure creation',
          label: "The asset was first created, usually the asset's origin",
        },
        {
          name: 'Paint tools',
          label: 'Edited with brushes or eraser tools',
        },
        {
          name: 'Imported assets',
          label: 'Added images, videos, etc.',
        },
        {
          name: 'Size adjustments',
          label: 'Changed asset dimensions',
        },
      ],
      producedBy: 'Gavin Peacock',
    },
    ingredients: [
      {
        data: {
          fileName: 'E-sig-CA.jpg',
          badge: 'alert',
          claimStatus: 'otgp',
        },
        ingredients: [
          {
            data: {
              fileName: 'A.jpg',
              claimStatus: 'none',
            },
          },
        ],
      },
    ],
  },
};

export default claim;
