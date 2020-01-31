import { GET_APPLICATION, GET_APPLICATION_COMPASS } from 'gql/queries';

export const exampleAppId = 'id';
export const exampleAppName = 'test-app-name';

export const exampleCompassApp = {
  id: 'compass-app-id',
  name: exampleAppName,
  providerName: 'test-provider-name',
  apiDefinitions: {
    data: [],
  },
  eventDefinitions: {
    data: [],
  },
};

export const exampleKymaApp = {
  name: exampleAppName,
  description: 'test-description',
  status: 'test-status',
  enabledInNamespaces: ['test-namespace'],
  labels: { test: 'label' },
};

export const mockCompassApp = {
  request: {
    query: GET_APPLICATION_COMPASS,
    variables: { id: exampleAppId },
  },
  result: {
    data: {
      application: exampleCompassApp,
    },
  },
};

export const mockKymaApp = {
  request: {
    query: GET_APPLICATION,
    variables: { name: exampleAppName },
  },
  result: {
    data: {
      application: exampleKymaApp,
    },
  },
};

export const mockCompassAppNull = {
  request: {
    query: GET_APPLICATION_COMPASS,
    variables: { id: exampleAppId },
  },
  result: {
    data: {
      application: null,
    },
  },
};

export const mockKymaAppNull = {
  request: {
    query: GET_APPLICATION,
    variables: { name: exampleAppName },
  },
  result: {
    data: {
      application: null,
    },
  },
};
