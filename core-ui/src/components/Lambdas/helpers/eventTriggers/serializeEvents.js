export function serializeEvents(events = [], eventTriggers = []) {
  if (!events.length) {
    const usedEvents = eventTriggers
      .map(event => {
        const filterAttributes = event.filterAttributes;

        if (!filterAttributes) {
          return null;
        }

        return {
          ...event,
          eventType: filterAttributes.type,
          source: filterAttributes.source,
          version: filterAttributes.eventtypeversion,
        };
      })
      .filter(Boolean);

    return [[], usedEvents];
  }

  const availableEvents = [];
  const usedEvents = [];

  events.map(event => {
    for (const trigger of eventTriggers) {
      const filterAttributes = trigger.filterAttributes;

      if (
        event.eventType === filterAttributes.type &&
        event.source === filterAttributes.source &&
        event.version === filterAttributes.eventtypeversion
      ) {
        usedEvents.push({
          ...event,
          ...trigger,
        });
        return event;
      }
    }
    availableEvents.push(event);
    return event;
  });

  return [availableEvents, usedEvents];
}
