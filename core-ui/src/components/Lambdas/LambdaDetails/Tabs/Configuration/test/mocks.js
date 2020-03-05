import { GET_SERVICE_INSTANCES } from 'gql/queries';

export const lambda = {
  name: 'lambda-name',
  namespace: 'default',
  status: 'RUNNING',
  labels: {},
  size: 'S',
  runtime: 'nodejs6',
  dependencies: 'dependencies',
  content: 'lambda code',
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
