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
