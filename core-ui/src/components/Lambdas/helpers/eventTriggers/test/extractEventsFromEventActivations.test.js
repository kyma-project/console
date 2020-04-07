import { extractEventsFromEventActivations } from '../extractEventsFromEventActivations';

describe('extractEventsFromEventActivations', () => {
  test('should return empty array - empty array as input', () => {
    const result = extractEventsFromEventActivations([]);
    expect(result).toEqual([]);
  });

  test('should return empty array - null as input', () => {
    const result = extractEventsFromEventActivations(null);
    expect(result).toEqual([]);
  });

  test('should return extracted events', () => {
    const eventActivations = [
      {
        events: [
          {
            eventType: '1',
            version: '1',
            schema: {},
          },
          {
            eventType: '2',
            version: '2',
            schema: {},
          },
        ],
        sourceId: 'activation1',
      },
      {
        events: [
          {
            eventType: '1',
            version: '1',
            schema: {},
          },
        ],
        sourceId: 'activation2',
      },
    ];
    const expected = [
      {
        eventType: '1',
        version: '1',
        schema: {},
        source: 'activation1',
        uniqueID: `activation1/1.1`,
      },
      {
        eventType: '2',
        version: '2',
        schema: {},
        source: 'activation1',
        uniqueID: `activation1/2.2`,
      },
      {
        eventType: '1',
        version: '1',
        schema: {},
        source: 'activation2',
        uniqueID: `activation2/1.1`,
      },
    ];

    const result = extractEventsFromEventActivations(eventActivations);
    expect(result).toEqual(expected);
  });
});
