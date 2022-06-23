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
  imagePath: 'XCA.jpg',
  description: 'top-level off the golden path',
  claim: {
    data: {
      fileName: 'XCA.jpg',
      badge: 'missing',
      claimStatus: 'otgp',
    },
    ingredients: [
      {
        data: {
          fileName: 'CA.jpg',
          badge: 'info',
          signedBy: 'Adobe, Inc.',
          signedOn: '10/13/21,  9:44 PM',
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
              fileName: 'A.jpg',
            },
          },
        ],
      },
    ],
  },
};

export default claim;
