import { service1, service2 } from 'testing/servicesMocks';
import { GET_SERVICES } from 'gql/queries';
import { EXCLUDED_SERVICES_LABELS } from 'components/ApiRules/constants';
import { DEFAULT_GATEWAY } from '../ApiRuleForm';

export const apiRuleName = 'test-123';
export const mockNamespace = 'test';
export const hostname = 'host-1.2.3';

export const apiRule = () => ({
  name: 'tets',
  spec: {
    service: {
      name: service1.name,
      host: 'tets.kyma.cluster.com',
      port: service1.ports[0].port,
    },
    gateway: DEFAULT_GATEWAY,
    rules: [
      {
        path: '/aaa',
        methods: ['GET', 'PUT'],
        accessStrategies: [
          {
            handler: 'noop',
          },
        ],
      },
      {
        path: '/bbb',
        methods: [],
        accessStrategies: [
          {
            handler: 'allow',
          },
        ],
      },
    ],
  },
});

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
