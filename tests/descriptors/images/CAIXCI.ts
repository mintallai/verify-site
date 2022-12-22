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
  imagePath: 'CAIXCI.jpg',
  description: 'nested off the golden path',
  claim: {
    data: {
      fileName: 'CAIXCI.jpg',
      badge: 'info',
      signedBy: 'C2PA Test Signing Cert Aug 1, 2022 at  6:48 PM EDT',
      signedOn: 'Aug 1, 2022 at  6:48 PM EDT',
      producedWith: 'make test images 0.11.1',
      editsAndActivity: [
        {
          name: 'Created',
          label: 'Created a new file or content',
        },
        {
          name: 'Drawing edits',
          label:
            'Used tools like pencils, brushes, erasers, or shape, path, or pen tools',
        },
        {
          name: 'Imported',
          label: 'Added pre-existing content to this file',
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
          fileName: 'CA.jpg',
          badge: 'info',
          signedBy: 'Adobe, Inc.',
          signedOn: 'Apr 20, 2022 at  6:44 PM EDT',
          producedWith: 'make test images 0.7.0',
          editsAndActivity: [
            {
              name: 'Color adjustments',
              label: 'Changed tone, saturation, etc.',
            },
            {
              name: 'Opened',
              label: 'Opened a pre-existing file',
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
          fileName: 'XCI.jpg',
          badge: 'missing',
          claimStatus: 'otgp',
        },
        ingredients: [
          {
            data: {
              fileName: 'CI.jpg',
              badge: 'info',
              signedBy: 'C2PA Test Signing Cert Aug 1, 2022 at  6:48 PM EDT',
              signedOn: 'Aug 1, 2022 at  6:48 PM EDT',
              producedWith: 'make test images 0.7.0',
              editsAndActivity: [
                {
                  name: 'Created',
                  label: 'Created a new file or content',
                },
                {
                  name: 'Drawing edits',
                  label:
                    'Used tools like pencils, brushes, erasers, or shape, path, or pen tools',
                },
                {
                  name: 'Imported',
                  label: 'Added pre-existing content to this file',
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
                  fileName: 'I.jpg',
                  claimStatus: 'none',
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export default claim;
