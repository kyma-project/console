import { service1, service2 } from 'testing/servicesMocks';
import { GET_SERVICES } from 'gql/queries';
import { CREATE_API_RULE } from 'gql/mutations';
import { EXCLUDED_SERVICES_LABELS } from 'components/ApiRules/constants';
import { supportedMethodsList } from 'components/ApiRules/accessStrategyTypes';

export const apiRuleName = 'test-123';
export const mockNamespace = 'test';
export const hostname = 'host-1.2.3';

export const createdAPIRule = {
  name: apiRuleName,
};

export const sampleAPIRule = {
  name: apiRuleName,
  namespace: mockNamespace,
  params: {
    host: `${hostname}.kyma.local`,
    serviceName: 'test',
    servicePort: '80',
    gateway: 'kyma-gateway.kyma-system.svc.cluster.local',
    rules: [
      {
        path: '/.*',
        methods: supportedMethodsList,
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

export const createApiRuleMutation = {
  request: {
    query: CREATE_API_RULE,
    variables: sampleAPIRule,
  },
  result: jest.fn().mockReturnValue({
    data: {
      createAPIRule: createdAPIRule,
    },
  }),
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
