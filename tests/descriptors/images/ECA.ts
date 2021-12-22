import { TestImageDescriptor } from "../types";

const claim: TestImageDescriptor = {
  imagePath: 'ECA.jpg',
  description: 'top-level error',
  claim: {
    data: {
      fileName: 'ECA.jpg',
      badge: 'alert',
      claimStatus: 'error'
    },
    ingredients: [{
      data: {
        fileName: 'CA.jpg',
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
            label: 'Added images, videos, etc.'
          },
        ],
        producedBy: 'Gavin Peacock',
        socialMedia: [{
          url: 'https://www.twitter.com/gvnpeacock',
          username: '@gvnpeacock'
        }]
      },
      ingredients: [{
        data: {
          fileName: 'A.jpg'
        }
      }]
    }]
  }
}

export default claim;
