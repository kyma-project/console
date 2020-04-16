import { UPDATE_LAMBDA } from 'components/Lambdas/gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const updatedFunction = {
  name: 'lambda',
};

export const UPDATE_LAMBDA_ERROR_MOCK = variables => ({
  request: {
    query: UPDATE_LAMBDA,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const UPDATE_LAMBDA_DATA_MOCK = (
  variables,
  updateFunction = updatedFunction,
) => ({
  request: {
    query: UPDATE_LAMBDA,
    variables,
  },
  result: {
    data: {
      updateFunction,
    },
  },
});
