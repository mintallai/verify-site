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
  imagePath: 'CAICAI.jpg',
  description: 'optimal path',
  claim: {
    data: {
      fileName: 'CAICAI.jpg',
      badge: 'info',
      signedBy: 'C2PA Test Signing Cert July 22, 2022 at  3:13 PM',
      signedOn: 'July 22, 2022 at  3:13 PM',
      producedWith: 'make test images 0.7.0',
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
          fileName: 'CA.jpg',
          badge: 'info',
          signedBy: 'C2PA Test Signing Cert July 22, 2022 at  3:13 PM',
          signedOn: 'July 22, 2022 at  3:13 PM',
          producedWith: 'make test images 0.7.0',
          editsAndActivity: [
            {
              name: 'Color adjustments',
              label: 'Changed tone, saturation, etc.',
            },
            {
              name: 'File opened',
              label:
                'An existing file containing one or more assets was opened and used as the starting point for editing',
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
      {
        data: {
          fileName: 'CAI.jpg',
          badge: 'info',
          signedBy: 'C2PA Test Signing Cert July 22, 2022 at  3:13 PM',
          signedOn: 'July 22, 2022 at  3:13 PM',
          producedWith: 'make test images 0.7.0',
          editsAndActivity: [
            {
              name: 'Color adjustments',
              label: 'Changed tone, saturation, etc.',
            },
            {
              name: 'File opened',
              label:
                'An existing file containing one or more assets was opened and used as the starting point for editing',
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
        },
        ingredients: [
          {
            data: {
              fileName: 'A.jpg',
            },
          },
          {
            data: {
              fileName: 'I.jpg',
            },
          },
        ],
      },
    ],
  },
};

export default claim;
