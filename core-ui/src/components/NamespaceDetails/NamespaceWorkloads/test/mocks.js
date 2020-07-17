import {
  DEPLOYMENT_EVENT_SUBSCRIPTION,
  POD_EVENT_SUBSCRIPTION,
} from 'gql/subscriptions';

export const namespace = {
  name: 'test-namespace',
  deployments: [
    { status: { replicas: 1, readyReplicas: 1 } },
    { status: { replicas: 0, readyReplicas: 1 } },
    { status: { replicas: 4, readyReplicas: 4 } },
  ],
  pods: [
    { status: 'SUCCEEDED' },
    { status: 'FAILED' },
    { status: 'NONE' },
    { status: 'SUCCEEDED' },
    { status: 'RUNNING' },
  ],
};

const deploymentSubscriptionMock = {
  request: {
    query: DEPLOYMENT_EVENT_SUBSCRIPTION,
    variables: { namespace: namespace.name },
  },
  result: { data: null },
};

const podsSubscriptionMock = {
  request: {
    query: POD_EVENT_SUBSCRIPTION,
    variables: { namespace: namespace.name },
  },
  result: { data: null },
};

export const subscriptionMocks = [
  deploymentSubscriptionMock,
  podsSubscriptionMock,
];
