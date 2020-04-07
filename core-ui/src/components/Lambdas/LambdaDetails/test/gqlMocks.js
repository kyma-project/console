import { GET_SERVICE_INSTANCES } from 'gql/queries';

export const lambdaNoContent = {
  name: 'testname',
  namespace: 'testnamespace',
  status: 'ERROR',
  labels: {},
  size: 'M',
  runtime: 'nodejs8',
  dependencies: 'test dependencies',
};

export const lambda = {
  ...lambdaNoContent,
  content: 'test content',
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
