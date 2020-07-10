import { GET_SERVICE } from 'components/Lambdas/gql/queries';
import { TESTING_STATE, serviceMock } from 'components/Lambdas/helpers/testing';

export const GET_SERVICE_ERROR_MOCK = variables => ({
  request: {
    query: GET_CONFIG_MAP,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_SERVICE_DATA_MOCK = (variables, service = serviceMock) => ({
  request: {
    query: GET_SERVICE,
    variables,
  },
  result: {
    data: {
      service,
    },
  },
});
