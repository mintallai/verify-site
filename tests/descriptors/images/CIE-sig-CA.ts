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
      signedBy: 'Adobe, Inc.',
      signedOn: 'April 20, 2022 at  6:44 PM',
      producedWith: 'C2PA',
      isBeta: true,
      editsAndActivity: [
        {
          name: 'Color adjustments',
          label: 'Changed tone, saturation, etc.',
        },
        {
          name: 'Imported assets',
          label: 'Added images, videos, etc.',
        },
        {
          name: 'Size and position adjustments',
          label: 'Changed size, orientation, direction, or position',
        },
      ],
      producedBy: 'Gavin Peacock',
      socialMedia: [
        {
          url: 'https://www.twitter.com/gvnpeacock',
          username: '@gvnpeacock',
        },
      ],
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
