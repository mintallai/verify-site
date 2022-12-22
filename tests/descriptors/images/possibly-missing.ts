// ADOBE CONFIDENTIAL
// Copyright 2022 Adobe
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
  imagePath: 'possibly-missing.png',
  description: 'possibly missing',
  overviewDisabled: false,
  claim: {
    data: {
      fileName: '24 edit in 23.png',
      badge: 'info',
      signedBy: 'Adobe Inc.',
      signedOn: 'Sep 30, 2022 at 4:38 PM EDT',
      producedWith: 'Adobe Photoshop 24.0.0',
      isBeta: false,
      isOriginalCreation: false,
      // This has a adobe.dictionary assertion which is why we are using the old text
      editsAndActivity: [
        {
          name: 'Imported assets',
          label: 'Added images, videos, etc.',
        },
        {
          name: 'Size and position adjustments',
          label: 'Changed size, orientation, direction, or position',
        },
        {
          name: 'Text assets',
          label: 'Used font, character, or other text elements',
        },
      ],
      unknownActionsAlert:
        'Some edits, activity, or asset actions may be missing from this content.',
      producedBy: 'irina maderych _Adobe_',
      socialMedia: [
        {
          username: '@irina maderych',
          url: 'https://www.behance.net/irinam1',
        },
      ],
    },
    ingredients: [
      {
        data: {
          fileName: '24 edit in 23.psd',
          claimStatus: 'none',
        },
      },
    ],
  },
};

export default claim;
