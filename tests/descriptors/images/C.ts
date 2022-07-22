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
  claim: {
    data: {
      fileName: 'C.jpg',
      badge: 'info',
      signedBy: 'C2PA Test Signing Cert July 22, 2022 at  3:13 PM',
      signedOn: 'July 22, 2022 at  3:13 PM',
      producedWith: 'make test images 0.7.0',
      isOriginalCreation: true,
      editsAndActivity: [
        {
          name: 'Secure creation',
          label: "The asset was first created, usually the asset's origin",
        },
        {
          name: 'Paint tools',
          label: 'Edited with brushes or eraser tools',
        },
      ],
      producedBy: 'Gavin Peacock',
    },
  },
};

export default claim;
