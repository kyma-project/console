import { CREATE_MANY_EVENT_TRIGGERS } from 'components/Lambdas/gql/mutations';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const singleCreateManyTriggers = [
  {
    name: 'trigger1',
  },
  {
    name: 'trigger2',
  },
];

export const CREATE_MANY_EVENT_TRIGGERS_ERROR_MOCK = variables => ({
  request: {
    query: CREATE_MANY_EVENT_TRIGGERS,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const CREATE_MANY_EVENT_TRIGGERS_DATA_MOCK = (
  variables,
  createManyTriggers = singleCreateManyTriggers,
) => ({
  request: {
    query: CREATE_MANY_EVENT_TRIGGERS,
    variables,
  },
  result: {
    data: {
      createManyTriggers,
    },
  },
});
