export function serializeEvents({ events = [], eventTriggers = [] }) {
  if (!events.length) {
    const usedEvents = eventTriggers.map(event => {
      const filterAttributes = event.spec.filter;
      return {
        ...event,
        eventType: filterAttributes.type,
        source: filterAttributes.source,
        version: filterAttributes.eventtypeversion,
      };
    });

    return {
      availableEvents: [],
      usedEvents,
    };
  }

  const availableEvents = [];
  const usedEvents = [];

  events.forEach(event => {
    let usedEvent = false;
    for (const trigger of eventTriggers) {
      const filterAttributes = trigger.spec.filter;

      if (
        event.eventType === filterAttributes.type &&
        event.source === filterAttributes.source &&
        event.version === filterAttributes.eventtypeversion
      ) {
        usedEvents.push({
          ...event,
          ...trigger,
        });
        usedEvent = true;
      }
    }

    if (!usedEvent) {
      availableEvents.push(event);
    }
  });

  eventTriggers.forEach(trigger => {
    const filterAttributes = trigger.spec.filter;
    const exists = usedEvents.some(
      e =>
        e.spec.filter.type === filterAttributes.type &&
        e.spec.filter.source === filterAttributes.source &&
        e.spec.filter.eventtypeversion === filterAttributes.eventtypeversion,
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

  return {
    availableEvents,
    usedEvents,
  };
}
