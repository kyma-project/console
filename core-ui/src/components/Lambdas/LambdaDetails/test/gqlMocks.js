import { GET_LAMBDA } from '../../../../gql/queries';

const params = {
  name: 'testname',
  namespace: 'testnamespace',
};

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

export const getLambdaSuccessMock = () => {
  return {
    request: {
      query: GET_LAMBDA,
      variables: params,
    },
    result: jest.fn().mockReturnValue({ data: { function: lambda } }),
  };
};
