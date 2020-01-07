import { handleNamespaceWsEvent } from '../wsHandler';

describe('Test updateQuery reducer', () => {
  const previousState = {
    namespaces: [
      {
        name: 'raz',
        labels: null,
        status: 'Active',
      },
      {
        name: 'dwa',
        labels: null,
        status: 'Active',
      },
    ],
  };

  it('Checks updateQuery "ADD" event handling', () => {
    const addEvent = {
      type: 'ADD',
      namespace: {
        name: 'trzy',
        labels: null,
        status: 'Active',
        pods: [],
        applications: [],
        isSystemNamespace: false,
      },
    };

    const expectedState = {
      namespaces: [...previousState.namespaces, addEvent.namespace],
    };

    const updatedStateAfterFirstEvent = handleNamespaceWsEvent(
      addEvent,
      previousState,
    );
    expect(updatedStateAfterFirstEvent).toEqual(expectedState);

    const updatedStateAfterSecondEvent = handleNamespaceWsEvent(
      addEvent,
      previousState,
    );
    expect(updatedStateAfterSecondEvent).toEqual(expectedState);
  });

  it('Checks updateQuery "UPDATE" event handling', () => {
    const updateEvent = {
      type: 'UPDATE',
      namespace: {
        name: 'raz',
        labels: null,
        status: 'Terminating',
        pods: [],
        applications: [],
        isSystemNamespace: false,
      },
    };

    const expectedState = {
      namespaces: [
        {
          name: 'raz',
          labels: null,
          status: 'Terminating',
          pods: [],
          applications: [],
          isSystemNamespace: false,
        },
        {
          name: 'dwa',
          labels: null,
          status: 'Active',
        },
      ],
    };

    const updatedState = handleNamespaceWsEvent(updateEvent, previousState);

    expect(updatedState).toEqual(expectedState);
  });
  it('Checks updateQuery "DELETE" event handling', () => {
    const deleteEvent = {
      type: 'DELETE',
      namespace: {
        name: 'raz',
        labels: null,
        status: 'Terminating',
        pods: [],
        applications: [],
        isSystemNamespace: false,
      },
    };

    const expectedState = {
      namespaces: [
        {
          name: 'dwa',
          labels: null,
          status: 'Active',
        },
      ],
    };

    const updatedStateAfterFirstEvent = handleNamespaceWsEvent(
      deleteEvent,
      previousState,
    );
    expect(updatedStateAfterFirstEvent).toEqual(expectedState);

    const updatedStateAfterSecondEvent = handleNamespaceWsEvent(
      deleteEvent,
      previousState,
    );
    expect(updatedStateAfterSecondEvent).toEqual(expectedState);
  });
});
