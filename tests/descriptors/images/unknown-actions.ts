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
  imagePath: 'unknown-actions.png',
  description: 'unknown actions',
  claim: {
    data: {
      fileName: 'Z1.png',
      badge: 'info',
      signedBy: 'Adobe Inc.',
      signedOn: 'July 29, 2022 at 5:43 AM',
      producedWith: 'Adobe Photoshop 23.5.0',
      isBeta: true,
      isOriginalCreation: true,
      editsAndActivity: [
        {
          name: 'Other changes',
          label:
            'Made changes not yet categorized by Content Credentials (Beta)',
        },
      ],
      unknownActionsAlert:
        'Some edits, activity, or asset actions may be missing from this content.',
      producedBy: 'Santosh Varma',
      socialMedia: [
        {
          username:
            '@SantoshSantoshSantoshSantoshSantoshSantoshSantoshSantoshSantoshSantosh AVARMAAVARMAAVARMAAVARMAAVARMAAVARMAA',
          url: 'https://www.behance.net/santoshvarmaa',
        },
        {
          username: '@Santoshvarmaa',
          url: 'https://twitter.com/Santoshvarmaa',
        },
        {
          username: '@santoshvarmaa',
          url: 'https://www.instagram.com/santoshvarmaa',
        },
      ],
      cryptoAddress: [
        {
          address: 'Ch6jnJGMRfHzrT7ivTq3pPnX6x6283obtwKLwCKQZZGA',
        },
      ],
    },
  },
};

export default claim;
