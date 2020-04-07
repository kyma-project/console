import { GET_EVENT_TRIGGERS } from 'components/Lambdas/gql/queries';
import { EVENT_TRIGGER_EVENT_SUBSCRIPTION } from 'components/Lambdas/gql/subscriptions';
import {
  TESTING_STATE,
  eventTriggerMock,
} from 'components/Lambdas/helpers/testing';

export const GET_EVENT_TRIGGERS_ERROR_MOCK = variables => ({
  request: {
    query: GET_EVENT_TRIGGERS,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_EVENT_TRIGGERS_DATA_MOCK = (
  variables,
  triggers = [eventTriggerMock],
) => ({
  request: {
    query: GET_EVENT_TRIGGERS,
    variables,
  },
  result: {
    data: {
      triggers,
    },
  },
});

export const EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK = (
  variables,
  triggerEvent = { type: 'ADD', trigger: eventTriggerMock },
) => ({
  request: {
    query: EVENT_TRIGGER_EVENT_SUBSCRIPTION,
    variables,
  },
  result: {
    data: {
      triggerEvent,
    },
  },
});
