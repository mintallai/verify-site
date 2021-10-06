import { _ } from 'svelte-i18n';
import Shepherd from 'shepherd.js';
import delay from 'delay';
import store from 'store2';
import TourStep from '../components/inspect/TourStep.svelte';
import {
  navigateToPath,
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

function getParentRef(storeReport: any) {
  const { claims, head } = storeReport;
  const rootClaim = claims[head];
  return rootClaim?.ingredients.find((x) => x.is_parent && !!x.provenance);
}

async function gotoRootClaim(storeReport: any) {
  // navigateToId(storeReport?.head, false, false);
  return delay(DELAY_MS);
}

async function gotoParentClaim(storeReport: any) {
  const parentRef = getParentRef(storeReport);
  if (parentRef) {
    secondaryId.set('');
    // navigateToId(parentRef.id, false, false);
    await delay(DELAY_MS);
  }
}

async function gotoCompare(storeReport: any) {
  const parentRef = getParentRef(storeReport);
  if (parentRef) {
    // navigateToId(parentRef.id, false, false);
    compareWithId(storeReport.head, false);
    await delay(DELAY_MS);
  }
}

export function createTour(storeReport: any) {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      popperOptions: {
        modifiers: [{ name: 'offset', options: { offset: [0, 7] } }],
      },
    },
    useModalOverlay: true,
  });

  tour.on('complete', () => {
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
    beforeShowPromise: () => gotoRootClaim(storeReport),
    text: () =>
      createComponent(tour, {
        title: 'tour.getTamperEvidentData.title',
        stepNum: 1,
        stepTotal: 3,
        content: 'tour.getTamperEvidentData.content',
      }),
  });

  tour.addStep({
    id: 'step-2',
    attachTo: {
      element: '#record-1',
      on: 'right',
    },
    beforeShowPromise: () => gotoParentClaim(storeReport),
    text: () =>
      createComponent(tour, {
        title: 'tour.explorePast.title',
        stepNum: 2,
        stepTotal: 3,
        content: 'tour.explorePast.content',
      }),
  });

  tour.addStep({
    id: 'step-3',
    attachTo: {
      element: '#breadcrumb-bar',
      on: 'left-start',
    },
    beforeShowPromise: () => gotoCompare(storeReport),
    text: () =>
      createComponent(tour, {
        title: 'tour.trackChanges.title',
        stepNum: 3,
        stepTotal: 3,
        content: 'tour.trackChanges.content',
      }),
  });

  return tour;
}

export function startTour({ storeReport, start, force }) {
  const hasSeenTour = store.get(COMPLETE_LOCALSTORAGE_KEY);
  if (!hasSeenTour || force) {
    const tour = createTour(storeReport);
    const stepIds = tour.steps.map((s) => s.id);
    if (start) {
      tour.start();
      if (stepIds.includes(start)) {
        tour.show(start);
      }
    }
    return tour;
  }
}
