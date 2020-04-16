import { GET_LAMBDA } from 'components/Lambdas/gql/queries';
import { TESTING_STATE, lambdaMock } from 'components/Lambdas/helpers/testing';

export const GET_LAMBDA_ERROR_MOCK = variables => ({
  request: {
    query: GET_LAMBDA,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_LAMBDA_DATA_MOCK = (variables, func = lambdaMock) => ({
  request: {
    query: GET_LAMBDA,
    variables,
  },
  result: {
    data: {
      function: func,
    },
  },
});
