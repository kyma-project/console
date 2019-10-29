import { GET_LAMBDA } from '../../../../gql/queries';

const params = {
  name: 'testname',
  namespace: 'testnamespace',
};

export const lambda = {
  name: 'testname',
  namespace: 'testnamespace',
  status: 'ERROR',
  labels: {},
  size: 'M',
  runtime: 'nodejs8',
  content: 'test content',
  dependencies: 'test dependencies',
  __typename: 'function',
};

export const getLambdaSuccessMock = () => {
  return {
    request: {
      query: GET_LAMBDA,
      variables: params,
    },
    result: jest.fn().mockReturnValue({ data: { function: lambda } }),
  };
};

export const getLambdaNoContentSuccessMock = () => {
  lambda.content = '';
  return {
    request: {
      query: GET_LAMBDA,
      variables: params,
    },
    result: jest.fn().mockReturnValue({ data: { function: lambda } }),
  };
};
