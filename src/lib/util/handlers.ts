import { IngestPayload, postEvent } from '../analytics';

export function handleUrl(
  url: string,
  evtSubtype: IngestPayload['event.subtype'],
) {
  return (evt) => {
    postEvent({
      'event.type': 'click',
      'event.subtype': evtSubtype,
    });
    window.open(url);
    evt.preventDefault();
  };
}
