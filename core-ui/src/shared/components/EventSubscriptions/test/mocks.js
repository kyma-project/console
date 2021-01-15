import { GET_EVENT_SUBSCRIPTIONS } from 'gql/queries';
import { EVENT_SUBSCRIPTION_SUBSCRIPTION } from 'gql/subscriptions';
import { UPDATE_EVENT_SUBSCRIPTION } from 'gql/mutations';
import { GET_EVENT_ACTIVATIONS } from 'components/Lambdas/gql/queries';

export const mockNamespace = 'test-namespace';
export const resource = { name: 'lambda', namespace: mockNamespace };

const subscriptionMock = {
  request: {
    query: EVENT_SUBSCRIPTION_SUBSCRIPTION,
    variables: {
      ownerName: resource.name,
      namespace: mockNamespace,
    },
  },
  result: {
    data: { subscriptionSubscription: { type: '', subscription: null } },
  },
};

const queryMock = {
  request: {
    query: GET_EVENT_SUBSCRIPTIONS,
    variables: {
      ownerName: resource.name,
      namespace: mockNamespace,
    },
  },
  result: {
    data: {
      eventSubscriptions: [
        {
          name: 'test-event-sub',
          namespace: mockNamespace,
          spec: {
            filter: {
              filters: [
                {
                  eventType: {
                    value: 'sap.kyma.custom.test-id.test-event.v1',
                    type: 'test',
                    property: 'test',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

const updateMock = {
  request: {
    query: UPDATE_EVENT_SUBSCRIPTION,
    variables: {
      ownerName: resource.name,
      namespace: mockNamespace,
      params: {},
    },
  },
  result: {
    data: {
      eventSubscription: {},
    },
  },
};

const eventActivationsMock = {
  request: {
    query: GET_EVENT_ACTIVATIONS,
    variables: { namespace: mockNamespace },
  },
  result: {
    data: {
      eventActivations: [
        {
          name: 'test-activation',
          sourceId: 'test-id',
          displayName: 'test-display-name',
          events: [
            {
              description: 'Test event',
              eventType: 'test-event',
              version: 'v1',
              schema: null,
            },
          ],
        },
      ],
    },
  },
};

export const mocks = [
  subscriptionMock,
  eventActivationsMock,
  queryMock,
  updateMock,
];
