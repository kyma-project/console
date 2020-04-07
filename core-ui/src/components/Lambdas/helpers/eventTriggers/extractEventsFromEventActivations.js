import { beautifyEventSchema } from './beautifyEventSchema';

export function extractEventsFromEventActivations(eventActivations = []) {
  if (!eventActivations || !eventActivations.length) {
    return [];
  }

  return eventActivations.flatMap(eventActivation =>
    (eventActivation.events || []).map(event => ({
      ...event,
      schema: beautifyEventSchema(event.schema),
      source: eventActivation.sourceId,
      uniqueID: `${eventActivation.sourceId}/${event.eventType}.${event.version}`,
    })),
  );
}
