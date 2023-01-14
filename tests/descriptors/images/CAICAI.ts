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
      signedBy: 'C2PA Test Signing Cert Aug 1, 2022 at  6:48 PM EDT',
      signedOn: 'Aug 1, 2022 at  6:48 PM EDT',
      producedWith: 'make test images 0.11.1',
      editsAndActivity: [
        {
          name: 'Color or exposure edits',
          label:
            'Adjusted properties like tone, saturation, curves, shadows, or highlights',
        },
        {
          name: 'Imported',
          label: 'Added pre-existing content to this file',
        },
        {
          name: 'Opened',
          label: 'Opened a pre-existing file',
        },
        {
          name: 'Resizing edits',
          label: 'Changed dimensions or file size',
        },
      ],
      producedBy: 'Gavin Peacock',
    },
    ingredients: [
      {
        data: {
          fileName: 'A.jpg',
          claimStatus: 'none',
        },
      },
      {
        data: {
          fileName: 'CAI.jpg',
          badge: 'info',
          signedBy: 'C2PA Test Signing Cert Aug 1, 2022 at  6:48 PM EDT',
          signedOn: 'Aug 1, 2022 at  6:48 PM EDT',
          producedWith: 'make test images 0.11.1',
          editsAndActivity: [
            {
              name: 'Color or exposure edits',
              label:
                'Adjusted properties like tone, saturation, curves, shadows, or highlights',
            },
            {
              name: 'Imported',
              label: 'Added pre-existing content to this file',
            },
            {
              name: 'Opened',
              label: 'Opened a pre-existing file',
            },
            {
              name: 'Resizing edits',
              label: 'Changed dimensions or file size',
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
