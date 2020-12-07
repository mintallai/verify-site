import Shepherd from 'shepherd.js';
import delay from 'delay';
import store from 'store2';
import TourStep from '../components/inspect/TourStep.svelte';
import {
  navigateToId,
  compareWithId,
  secondaryId,
  navigateToRoot,
} from '../stores';

const COMPLETE_LOCALSTORAGE_KEY = 'hasSeenTour';
const DELAY_MS = 500;

function createComponent(tour, props) {
  const component = new TourStep({
    target: document.body,
    props,
  });
  component.$on('message', ({ detail }) => {
    switch (detail?.action) {
      case 'back':
        tour.back();
        break;
      case 'next':
        tour.next();
        break;
      case 'done':
        tour.complete();
        break;
    }
  });
  return component.getElement();
}

function getParentRef(summary) {
  const rootClaim = summary?.claims[summary.root_claim_id];
  return rootClaim?.references.find((x) => x.type === 'parent' && !!x.claim_id);
}

async function gotoRootClaim(summary) {
  navigateToId(`claim_id:${summary.root_claim_id}`, false, false);
  return delay(DELAY_MS);
}

async function gotoParentClaim(summary) {
  const parentRef = getParentRef(summary);
  if (parentRef) {
    secondaryId.set('');
    navigateToId(`claim_id:${parentRef.claim_id}`, false, false);
    await delay(DELAY_MS);
  }
}

async function gotoCompare(summary) {
  const parentRef = getParentRef(summary);
  if (parentRef) {
    navigateToId(`claim_id:${parentRef.claim_id}`, false, false);
    compareWithId(`claim_id:${summary.root_claim_id}`, false);
    await delay(DELAY_MS);
  }
}

export function createTour({ summary }) {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      popperOptions: {
        modifiers: [{ name: 'offset', options: { offset: [0, 7] } }],
      },
    },
    useModalOverlay: true,
  });

  tour.on('complete', () => {
    console.debug('Tour completed');
    store.set(COMPLETE_LOCALSTORAGE_KEY, Date.now());
    navigateToRoot(false);
    window.newrelic?.addPageAction('finishedTour');
  });

  tour.addStep({
    id: 'step-1',
    attachTo: {
      element: '#record-0',
      on: 'right',
    },
    beforeShowPromise: () => gotoRootClaim(summary),
    text: () =>
      createComponent(tour, {
        title: 'Get tamper-evident image data',
        stepNum: 1,
        stepTotal: 3,
        content:
          'No matter where the content shows up on the internet, the info icon tells you that its record was confirmed.',
      }),
  });

  tour.addStep({
    id: 'step-2',
    attachTo: {
      element: '#record-1',
      on: 'right',
    },
    beforeShowPromise: () => gotoParentClaim(summary),
    text: () =>
      createComponent(tour, {
        title: 'Explore a JPEG’s past',
        stepNum: 2,
        stepTotal: 3,
        content:
          'The most recent version appears first in the content record, followed by previous versions and any component elements, like other images.',
      }),
  });

  tour.addStep({
    id: 'step-3',
    attachTo: {
      element: '#compare-selector',
      on: 'left-start',
    },
    beforeShowPromise: () => gotoCompare(summary),
    text: () =>
      createComponent(tour, {
        title: 'Track changes over time',
        stepNum: 3,
        stepTotal: 3,
        content:
          'Select an image to view its own content record. Or compare it to another entry in the content record in a slider or split-screen view.',
      }),
  });

  return tour;
}

export function startTour({ summary, start, force }) {
  const hasSeenTour = store.get(COMPLETE_LOCALSTORAGE_KEY);
  if (!hasSeenTour || force) {
    const tour = createTour({ summary });
    const stepIds = tour.steps.map((s) => s.id);
    if (start) {
      tour.start();
      if (stepIds.includes(start)) {
        tour.show(start);
      }
    }
  }
}
