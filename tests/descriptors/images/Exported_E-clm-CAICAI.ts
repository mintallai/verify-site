// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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
  imagePath: 'Exported_E-clm-CAICAI.jpg',
  description: 'exported error',
  claim: {
    data: {
      fileName: 'Exported_E-clm-CAICAI.jpg',
      badge: 'info',
      signedBy: 'Adobe Inc.',
      signedOn: 'Jan 11, 2023 at 6:51 PM EST',
      producedWith: 'Adobe Photoshop 24.2.0',
      editsAndActivity: [
        {
          name: 'Opened',
          label: 'Opened a pre-existing file',
        },
      ],
      producedBy: 'Shruti Kangokar',
      socialMedia: [
        {
          username: '@Shruti Kangokar',
          url: 'https://www.behance.net/shrutikangokar',
        },
        {
          username: '@testshruti1234',
          url: 'https://www.instagram.com/testshruti1234',
        },
      ],
    },
    ingredients: [
      {
        data: {
          fileName: 'E-clm-CAICAI.jpg',
          badge: 'alert',
          claimStatus: 'error',
        },
        ingredients: [],
      },
    ],
  },
};

export default claim;
