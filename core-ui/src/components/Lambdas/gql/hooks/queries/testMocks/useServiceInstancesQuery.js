import { GET_SERVICE_INSTANCES } from 'components/Lambdas/gql/queries';
import {
  TESTING_STATE,
  serviceInstanceMock,
} from 'components/Lambdas/helpers/testing';

export const GET_SERVICE_INSTANCES_ERROR_MOCK = variables => ({
  request: {
    query: GET_SERVICE_INSTANCES,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_SERVICE_INSTANCES_DATA_MOCK = (
  variables,
  serviceInstances = [serviceInstanceMock],
) => ({
  request: {
    query: GET_SERVICE_INSTANCES,
    variables,
  },
  result: {
    data: {
      serviceInstances,
    },
  },
});
