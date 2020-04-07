import { GET_EVENT_ACTIVATIONS } from 'components/Lambdas/gql/queries';
import {
  TESTING_STATE,
  eventActivationMock,
} from 'components/Lambdas/helpers/testing';

export const GET_EVENT_ACTIVATIONS_ERROR_MOCK = variables => ({
  request: {
    query: GET_EVENT_ACTIVATIONS,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_EVENT_ACTIVATIONS_DATA_MOCK = (
  variables,
  eventActivations = [eventActivationMock],
) => ({
  request: {
    query: GET_EVENT_ACTIVATIONS,
    variables,
  },
  result: {
    data: {
      eventActivations,
    },
  },
});
