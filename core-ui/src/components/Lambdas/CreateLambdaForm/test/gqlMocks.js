import { CREATE_LAMBDA } from '../../../../gql/mutations';

const variables = {
  name: 'testname',
  namespace: 'testNamespace',
  labels: {
    testKey: 'testValue',
  },
  size: 'M',
  runtime: 'nodejs8',
};

export const createLambdaSuccessfulMock = () => {
  return {
    request: {
      query: CREATE_LAMBDA,
      variables,
    },
    result: jest.fn().mockReturnValue({ data: variables }),
  };
};

export const createLambdaErrorMock = () => ({
  request: {
    query: CREATE_LAMBDA,
    variables,
  },
  result: jest.fn().mockReturnValue({ data: {} }),
  error: new Error(':('),
});
