import { DELETE_API_RULE } from 'gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const DELETE_API_RULE_ERROR_MOCK = variables => ({
  request: {
    query: DELETE_API_RULE,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const DELETE_API_RULE_DATA_MOCK = variables => ({
  request: {
    query: DELETE_API_RULE,
    variables,
  },
  result: {
    data: {
      deleteAPIRule: {
        name: variables.name,
      },
    },
  },
});
