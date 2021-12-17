import { TestImageDescriptor } from "../types";

const claim: TestImageDescriptor = {
  imagePath: 'A.jpg',
  description: 'no claim',
  claim: {
    data: {
      fileName: 'A.jpg',
      claimStatus: 'none'
    }
  }
}

export default claim;
