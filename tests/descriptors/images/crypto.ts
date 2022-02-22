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
  imagePath: 'crypto.jpg',
  description: 'attached crypto address',
  claim: {
    data: {
      fileName: 'crypto.jpg',
      badge: 'info',
      signedBy: 'Adobe Inc.',
      signedOn: '12/21/21,  12:35 PM',
      producedWith: 'Adobe Photoshop 23.1.0',
      isBeta: true,
      isOriginalCreation: true,
      editsAndActivity: [
        {
          name: 'Paint tools',
          label: 'Edited with brushes or eraser tools',
        },
      ],
      producedBy: 'Eli Mensch',
      cryptoAddress: [
        {
          address: '0x5e6bd70bc8df4b35a5b81fd7814623d81ce1609e',
        },
      ],
    },
  },
};

export default claim;
