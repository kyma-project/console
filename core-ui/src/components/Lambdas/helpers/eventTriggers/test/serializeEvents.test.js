import { serializeEvents } from '../serializeEvents';

describe('serializeEvents', () => {
  test('should return only usedEvents array', () => {
    const { availableEvents, usedEvents } = serializeEvents({
      events: [],
      eventTriggers: [
        {
          spec: {
            filter: {
              type: '1',
              source: '1',
              eventtypeversion: '1',
            },
          },
        },
      ],
    });
    expect(usedEvents.length).toEqual(1);
    expect(availableEvents.length).toEqual(0);
  });

  test('should return only availableEvents array', () => {
    const { availableEvents, usedEvents } = serializeEvents({
      events: [
        {
          eventType: '1',
          source: '1',
          version: '1',
        },
      ],
      eventTriggers: [],
    });
    expect(usedEvents.length).toEqual(0);
    expect(availableEvents.length).toEqual(1);
  });

  test('should return filtered events', () => {
    const event1 = {
      eventType: '1',
      source: '1',
      version: '1',
    };
    const event2 = {
      eventType: '2',
      source: '2',
      version: '2',
    };
    const event3 = {
      eventType: '3',
      source: '3',
      version: '3',
    };
    const eventTrigger1 = {
      spec: {
        filter: {
          type: '1',
          source: '1',
          eventtypeversion: '1',
        },
      },
    };
    const eventTrigger2 = {
      spec: {
        filter: {
          type: '2',
          source: '2',
          eventtypeversion: '2',
        },
      },
    };

    const events = [event1, event2, event3];
    const eventTriggers = [eventTrigger1, eventTrigger2];

    const { availableEvents, usedEvents } = serializeEvents({
      events,
      eventTriggers,
    });
    expect(usedEvents.length).toEqual(2);
    expect(availableEvents.length).toEqual(1);
    expect(availableEvents[0]).toStrictEqual(event3);
  });

  test('should return filtered events with non defined in Event Activations', () => {
    const event1 = {
      eventType: '1',
      source: '1',
      version: '1',
    };
    const event2 = {
      eventType: '2',
      source: '2',
      version: '2',
    };
    const event3 = {
      eventType: '3',
      source: '3',
      version: '3',
    };
    const eventTrigger1 = {
      spec: {
        filter: {
          type: '1',
          eventtypeversion: '1',
        },
      },
    };
    const eventTrigger2 = {
      spec: {
        filter: {
          type: '2',
          source: '2',
        },
      },
    };
    const eventTrigger3 = {
      spec: {
        filter: {
          source: '3',
          eventtypeversion: '3',
        },
      },
    };
    const eventTrigger4 = {
      spec: {
        filter: {
          type: '1',
          source: '1',
          eventtypeversion: '1',
        },
      },
    };

    const events = [event1, event2, event3];
    const eventTriggers = [
      eventTrigger1,
      eventTrigger2,
      eventTrigger3,
      eventTrigger4,
    ];

    const { availableEvents, usedEvents } = serializeEvents({
      events,
      eventTriggers,
    });
    expect(usedEvents.length).toEqual(4);
    expect(availableEvents.length).toEqual(2);
  });

  test('should return duplicated Event Triggers', () => {
    const event1 = {
      eventType: '1',
      source: '1',
      version: '1',
    };
    const event2 = {
      eventType: '2',
      source: '2',
      version: '2',
    };
    const event3 = {
      eventType: '3',
      source: '3',
      version: '3',
    };
    const eventTrigger1 = {
      spec: {
        filter: {
          type: '1',
          source: '1',
          eventtypeversion: '1',
        },
      },
    };
    const eventTrigger2 = {
      spec: {
        filter: {
          type: '2',
          source: '2',
          eventtypeversion: '2',
        },
      },
    };
    const eventTrigger3 = {
      spec: {
        filter: {
          type: '2',
          source: '2',
          eventtypeversion: '2',
        },
      },
    };

    const events = [event1, event2, event3];
    const eventTriggers = [eventTrigger1, eventTrigger2, eventTrigger3];

    const { availableEvents, usedEvents } = serializeEvents({
      events,
      eventTriggers,
    });
    expect(usedEvents.length).toEqual(3);
    expect(availableEvents.length).toEqual(1);
  });
});
