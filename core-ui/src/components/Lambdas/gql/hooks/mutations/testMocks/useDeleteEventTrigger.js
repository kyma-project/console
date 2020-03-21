import { DELETE_ONE_EVENT_TRIGGER } from 'components/Lambdas/gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const singleDeleteTrigger = {
  name: 'eventTrigger',
};

export const DELETE_ONE_EVENT_TRIGGER_ERROR_MOCK = variables => ({
  request: {
    query: DELETE_ONE_EVENT_TRIGGER,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const DELETE_ONE_EVENT_TRIGGER_DATA_MOCK = (
  variables,
  deleteTrigger = singleDeleteTrigger,
) => ({
  request: {
    query: DELETE_ONE_EVENT_TRIGGER,
    variables,
  },
  result: {
    data: {
      deleteTrigger,
    },
  },
});
