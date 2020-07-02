import { GET_API_RULES } from 'gql/queries';
import { API_RULE_EVENT_SUBSCRIPTION } from 'gql/subscriptions';
import { TESTING_STATE } from 'components/Lambdas/helpers/testing';

export const apiRuleMock = {
  name: 'apiRule',
  spec: {
    rules: [
      {
        path: '/.*',
        methods: ['GET', 'POST'],
        accessStrategies: [
          {
            name: 'nope',
            config: {},
          },
        ],
      },
    ],
    service: {
      host: 'host',
      name: 'service',
      port: '80',
    },
  },
  status: {
    apiRuleStatus: {
      code: 'OK',
      description: '',
    },
  },
};

export const GET_API_RULES_ERROR_MOCK = variables => ({
  request: {
    query: GET_API_RULES,
    variables,
  },
  error: new Error(TESTING_STATE.ERROR),
});

export const GET_API_RULES_DATA_MOCK = (
  variables,
  APIRules = [apiRuleMock],
) => ({
  request: {
    query: GET_API_RULES,
    variables,
  },
  result: {
    data: {
      APIRules,
    },
  },
});

export const API_RULE_EVENT_SUBSCRIPTION_MOCK = (
  variables,
  apiRuleEvent = { type: 'ADD', apiRule: apiRuleMock },
) => ({
  request: {
    query: API_RULE_EVENT_SUBSCRIPTION,
    variables,
  },
  result: {
    data: {
      apiRuleEvent,
    },
  },
});
