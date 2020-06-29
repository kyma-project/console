import { GET_API_RULE, GET_SERVICES } from 'gql/queries';
import { service1, service2 } from 'testing/servicesMocks';
import { UPDATE_API_RULE } from 'gql/mutations';
import { EXCLUDED_SERVICES_LABELS } from 'components/ApiRules/constants';

export const mockNamespace = 'test';
export const oldHostname = 'unsuitable-snake';
export const newHostname = 'different-hostname';

export const apiRule = {
  name: 'test-123',
  spec: {
    service: {
      host: `${oldHostname}.kyma.local`,
      name: 'test',
      port: 80,
    },
    gateway: 'kyma-gateway.kyma-system.svc.cluster.local',
    rules: [
      {
        path: '/.*',
        methods: ['PUT', 'POST', 'GET', 'DELETE'],
        accessStrategies: [
          {
            name: 'noop',
            config: {},
          },
        ],
      },
    ],
  },
};

export const getApiRuleQuery = {
  request: {
    query: GET_API_RULE,
    variables: {
      name: apiRule.name,
      namespace: mockNamespace,
    },
  },
  result: {
    data: {
      APIRule: apiRule,
    },
  },
};

export const servicesQuery = {
  request: {
    query: GET_SERVICES,
    variables: {
      namespace: mockNamespace,
      excludedLabels: EXCLUDED_SERVICES_LABELS,
    },
  },
  result: {
    data: {
      services: [service1, service2],
    },
  },
};

export const updateApiRuleMutation = {
  request: {
    query: UPDATE_API_RULE,
    variables: {
      name: apiRule.name,
      namespace: mockNamespace,
      params: {
        service: {
          ...apiRule.spec.service,
          host: `${newHostname}.kyma.local`,
        },
        gateway: apiRule.spec.gateway,
        rules: apiRule.spec.rules,
      },
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      updateAPIRule: {
        name: apiRule.name,
      },
    },
  }),
};
