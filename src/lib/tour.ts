import Shepherd from 'shepherd.js';
import TourStep from '../components/inspect/TourStep.svelte';

const tour = new Shepherd.Tour({
  defaultStepOptions: {
    classes: 'shadow-md bg-purple-dark',
  },
});

tour.addStep({
  id: 'step-1',
  attachTo: {
    element: '#record-0',
    on: 'auto-start',
  },
  text: () =>
    new TourStep({
      target: document.body,
      props: {
        title: 'Get tamper-evident image data',
        stepNum: 1,
        stepTotal: 3,
        content:
          'No matter where the content shows up on the internet, the icon tells you that its record was confirmed.',
      },
    }).getElement(),
});

export default tour;
