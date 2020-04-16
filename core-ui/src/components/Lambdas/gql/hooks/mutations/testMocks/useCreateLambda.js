import { CREATE_LAMBDA } from 'components/Lambdas/gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const createdFunction = {
  name: 'lambda',
};

export const CREATE_LAMBDA_ERROR_MOCK = variables => ({
  request: {
    query: CREATE_LAMBDA,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const CREATE_LAMBDA_DATA_MOCK = (
  variables,
  createFunction = createdFunction,
) => ({
  request: {
    query: CREATE_LAMBDA,
    variables,
  },
  result: {
    data: {
      createFunction,
    },
  },
});
