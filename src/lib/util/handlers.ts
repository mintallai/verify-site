import { postEvent } from '../analytics';
import type { IngestPayload } from '../analytics';

export function handleUrl(
  url: string,
  evtSubtype: IngestPayload['event.subtype'],
) {
  return (evt: Event) => {
    postEvent({
      'event.type': 'click',
      'event.subtype': evtSubtype,
    });
    window.open(url);
    evt.preventDefault();
  };
}
