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
  imagePath: 'C.jpg',
  description: 'single claim - original creation',
  overviewDisabled: true,
  claim: {
    data: {
      fileName: 'C.jpg',
      badge: 'info',
      signedBy: 'C2PA Test Signing Cert Aug 1, 2022 at  6:48 PM EDT',
      signedOn: 'Aug 1, 2022 at  6:48 PM EDT',
      producedWith: 'make test images 0.11.1',
      isOriginalCreation: true,
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
      ],
      producedBy: 'Gavin Peacock',
    },
  },
};

export default claim;
