import { serializeEvents } from '../serializeEvents';

describe('serializeEvents', () => {
  test('return only usedEvents array', () => {
    const [availableEvents, usedEvents] = serializeEvents(
      [],
      [
        {
          filterAttributes: {
            type: '1',
            source: '1',
            eventtypeversion: '1',
          },
        },
      ],
    );
    expect(usedEvents.length).toEqual(1);
    expect(availableEvents.length).toEqual(0);
  });

  test('return only availableEvents array', () => {
    const [availableEvents, usedEvents] = serializeEvents(
      [
        {
          eventType: '1',
          source: '1',
          version: '1',
        },
      ],
      [],
    );
    expect(usedEvents.length).toEqual(0);
    expect(availableEvents.length).toEqual(1);
  });

  test('return filtered events', () => {
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
      filterAttributes: {
        type: '1',
        source: '1',
        eventtypeversion: '1',
      },
    };
    const eventTrigger2 = {
      filterAttributes: {
        type: '2',
        source: '2',
        eventtypeversion: '2',
      },
    };

    const events = [event1, event2, event3];
    const eventTriggers = [eventTrigger1, eventTrigger2];

    const [availableEvents, usedEvents] = serializeEvents(
      events,
      eventTriggers,
    );
    expect(usedEvents.length).toEqual(2);
    expect(availableEvents.length).toEqual(1);
    expect(availableEvents[0]).toStrictEqual(event3);
  });
});
