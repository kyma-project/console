import { GET_CONFIG_MAP } from 'components/Lambdas/gql/queries';
import {
  TESTING_STATE,
  configMapMock,
} from 'components/Lambdas/helpers/testing';

export const GET_CONFIG_MAP_ERROR_MOCK = variables => ({
  request: {
    query: GET_CONFIG_MAP,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_CONFIG_MAP_DATA_MOCK = (
  variables,
  configMap = configMapMock,
) => ({
  request: {
    query: GET_CONFIG_MAP,
    variables,
  },
  result: {
    data: {
      configMap,
    },
  },
});
