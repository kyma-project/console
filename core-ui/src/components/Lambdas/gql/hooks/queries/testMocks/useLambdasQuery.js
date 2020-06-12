import { GET_LAMBDAS, GET_CONFIGMAP } from 'components/Lambdas/gql/queries';
import { LAMBDA_EVENT_SUBSCRIPTION } from 'components/Lambdas/gql/subscriptions';
import {
  TESTING_STATE,
  lambdaMock,
  configMapMock,
} from 'components/Lambdas/helpers/testing';

export const GET_LAMBDAS_ERROR_MOCK = variables => ({
  request: {
    query: GET_LAMBDAS,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_LAMBDAS_DATA_MOCK = (variables, functions = [lambdaMock]) => ({
  request: {
    query: GET_LAMBDAS,
    variables,
  },
  result: {
    data: {
      functions,
    },
  },
});

export const GET_CONFIGMAP_DATA_MOCK = variables => ({
  request: {
    query: GET_CONFIGMAP,
    variables,
  },
  result: {
    data: {
      configMapMock,
    },
  },
});

export const LAMBDA_EVENT_SUBSCRIPTION_MOCK = (
  variables,
  functionEvent = { type: 'ADD', function: lambdaMock },
) => ({
  request: {
    query: LAMBDA_EVENT_SUBSCRIPTION,
    variables,
  },
  result: {
    data: {
      functionEvent,
    },
  },
});
