import { CREATE_LAMBDA } from '../../../../gql/mutations';

const lambda = {
  name: 'testname',
  namespace: 'testnamespace',
  labels: {},
  size: 'S',
  runtime: 'nodejs6',
};

export const createLambdaSuccessfulMock = () => {
  return {
    request: {
      query: CREATE_LAMBDA,
      variables: lambda,
    },
    result: jest.fn().mockReturnValue({ data: { createFunction: lambda } }),
  };
};

export const createLambdaErrorMock = () => ({
  request: {
    query: CREATE_LAMBDA,
    variables: lambda,
  },
  error: new Error('Lambda already exists'),
});
