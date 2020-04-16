import { DELETE_LAMBDA } from 'components/Lambdas/gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const deletedFunction = {
  name: 'lambda',
};

export const DELETE_LAMBDA_ERROR_MOCK = variables => ({
  request: {
    query: DELETE_LAMBDA,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const DELETE_LAMBDA_DATA_MOCK = (
  variables,
  deleteFunction = deletedFunction,
) => ({
  request: {
    query: DELETE_LAMBDA,
    variables,
  },
  result: {
    data: {
      deleteFunction,
    },
  },
});
