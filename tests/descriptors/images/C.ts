import { TestImageDescriptor } from '../types';

const claim: TestImageDescriptor = {
  imagePath: 'C.jpg',
  description: 'single claim - original creation',
  claim: {
    data: {
      fileName: 'C.jpg',
      badge: 'info',
      signedBy: 'Adobe, Inc.',
      signedOn: '10/13/21,  9:44 PM',
      producedWith: 'C2PA Testing',
      isBeta: true,
      isOriginalCreation: true,
      editsAndActivity: [
        {
          name: 'Color adjustments',
          label: 'Changed tone, saturation, etc.',
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
  },
};

export default claim;
