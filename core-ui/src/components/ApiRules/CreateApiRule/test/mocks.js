import { service1, service2 } from 'testing/servicesMocks';
import { GET_SERVICES } from 'gql/queries';
import { CREATE_API_RULE } from 'gql/mutations';
import { excludedServicesLabels } from 'components/ApiRules/constants';

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
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        accessStrategies: [
          {
            name: 'noop',
            config: {},
          },
        ],
        mutators: [],
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
      excludedLabels: excludedServicesLabels,
    },
  },
  result: {
    data: {
      services: [service1, service2],
    },
  },
};
