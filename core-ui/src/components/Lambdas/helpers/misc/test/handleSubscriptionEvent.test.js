import {
  handleSubscriptionEvent,
  SUBSCRIPTION_EVENT_TYPES,
} from '../handleSubscriptionEvent';

describe('handleSubscriptionEvent', () => {
  const collection = [
    {
      name: 'pico',
      labels: {
        foo: 'bar',
      },
    },
    {
      name: 'bello',
      labels: {
        foo: 'bar',
      },
    },
    {
      name: 'epstein',
      labels: {
        foo: 'bar',
      },
    },
  ];

  it('Checks "ADD" event handling', () => {
    const addEvent = {
      type: SUBSCRIPTION_EVENT_TYPES.ADD,
      newItem: {
        name: '2137',
      },
    };

    const expectedResult = [...collection, addEvent.newItem];
    const result = handleSubscriptionEvent(addEvent, collection);
    expect(result).toEqual(expectedResult);
  });

  it('Checks "UPDATE" event handling', () => {
    let updateEvent = {
      type: SUBSCRIPTION_EVENT_TYPES.UPDATE,
      newItem: {
        name: '2137',
        labels: {
          foo: 'bar',
        },
      },
    };

    let expectedResult = [...collection, updateEvent.newItem];
    let result = handleSubscriptionEvent(updateEvent, collection);
    expect(result).toEqual(expectedResult);

    updateEvent = {
      type: SUBSCRIPTION_EVENT_TYPES.UPDATE,
      newItem: {
        name: '2137',
        labels: {
          foo: 'foo',
        },
      },
    };

    expectedResult[3] = updateEvent.newItem;
    result = handleSubscriptionEvent(updateEvent, collection);
    expect(result).toEqual(expectedResult);
  });

  it('Checks "DELETE" event handling', () => {
    const deleteEvent = {
      type: SUBSCRIPTION_EVENT_TYPES.DELETE,
      newItem: {
        name: 'epstein', // huehue
      },
    };

    const expectedResult = [collection[0], collection[1]];
    const result = handleSubscriptionEvent(deleteEvent, collection);
    expect(result).toEqual(expectedResult);
  });
});
