export function serializeEvents(events = [], eventTriggers = []) {
  if (!events.length) {
    const usedEvents = eventTriggers.map(event => {
      const filterAttributes = event.filterAttributes;
      return {
        ...event,
        eventType: filterAttributes.type,
        source: filterAttributes.source,
        version: filterAttributes.eventtypeversion,
      };
    });

    return [[], usedEvents];
  }

  const availableEvents = [];
  const usedEvents = [];

  events.forEach(event => {
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
        return;
      }
    }
    availableEvents.push(event);
  });

  eventTriggers.forEach(trigger => {
    const filterAttributes = trigger.filterAttributes;
    const exists = usedEvents.some(
      e =>
        e.filterAttributes.type === filterAttributes.type &&
        e.filterAttributes.source === filterAttributes.source &&
        e.filterAttributes.eventtypeversion ===
          filterAttributes.eventtypeversion,
    );

    if (!exists) {
      usedEvents.push({
        ...trigger,
        eventType: filterAttributes.type,
        source: filterAttributes.source,
        version: filterAttributes.eventtypeversion,
      });
    }
  });

  return [availableEvents, usedEvents];
}
