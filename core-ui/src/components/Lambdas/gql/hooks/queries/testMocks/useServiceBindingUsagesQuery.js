import { GET_SERVICE_BINDING_USAGES } from 'components/Lambdas/gql/queries';
import { SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION } from 'components/Lambdas/gql/subscriptions';
import {
  TESTING_STATE,
  serviceBindingUsageMock,
} from 'components/Lambdas/helpers/testing';

export const GET_SERVICE_BINDING_USAGES_ERROR_MOCK = variables => ({
  request: {
    query: GET_SERVICE_BINDING_USAGES,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_SERVICE_BINDING_USAGES_DATA_MOCK = (
  variables,
  serviceBindingUsages = [serviceBindingUsageMock],
) => ({
  request: {
    query: GET_SERVICE_BINDING_USAGES,
    variables,
  },
  result: {
    data: {
      serviceBindingUsages,
    },
  },
});

export const SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK = (
  variables,
  serviceBindingUsageEvent = {
    type: 'ADD',
    serviceBindingUsage: serviceBindingUsageMock,
  },
) => ({
  request: {
    query: SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION,
    variables,
  },
  result: {
    data: {
      serviceBindingUsageEvent,
    },
  },
});
