import { GET_SERVICE_INSTANCES } from 'gql/queries';

export const lambda = {
  name: 'testname',
  namespace: 'testnamespace',
  status: 'ERROR',
  labels: {},
  size: 'M',
  runtime: 'nodejs8',
  dependencies: 'test dependencies',
  content: 'test content',
  serviceBindingUsages: [],
};

export const serviceBindingUsage = {
  name: 'test',
  parameters: {
    envPrefix: {
      name: 'test_',
    },
  },
  serviceBinding: {
    name: 'binding',
    serviceInstanceName: 'testname',
    secret: {
      name: 'secret',
      data: {},
    },
  },
};

export const mocks = [
  {
    request: {
      query: GET_SERVICE_INSTANCES,
      variables: {
        namespace: 'testnamespace',
        status: 'RUNNING',
      },
    },
    result: {
      data: {},
    },
  },
];
