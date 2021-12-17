import { TestImageDescriptor } from '../types';

const claim: TestImageDescriptor = {
  imagePath: 'CAIECA.jpg',
  description: 'nested error',
  claim: {
    data: {
      fileName: 'CAIECA.jpg',
      badge: 'info',
      signedBy: 'Adobe, Inc.',
      signedOn: '10/13/21,  9:44 PM',
      producedWith: 'C2PA Testing',
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
          fileName: 'A.jpg',
          claimStatus: 'none',
        },
      },
      {
        data: {
          fileName: 'ECA.jpg',
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
