import { service1, service2 } from 'testing/servicesMocks';
import { GET_SERVICES, GET_IDP_PRESETS } from 'gql/queries';

export const apiRuleName = 'test-123';
export const mockNamespace = 'test';
export const hostname = 'host-1.2.3';

export const apiRule = () => ({
  name: 'tets',
  service: {
    name: service1.name,
    host: 'tets.kyma.cluster.com',
    port: service1.ports[0].port,
  },
  rules: [
    {
      path: '/aaa',
      methods: ['GET', 'PUT'],
      accessStrategies: [
        {
          name: 'noop',
        },
      ],
    },
    {
      path: '/bbb',
      methods: ['POST', 'DELETE'],
      accessStrategies: [
        {
          name: 'noop',
        },
      ],
    },
  ],
});

export const servicesQuery = {
  request: {
    query: GET_SERVICES,
    variables: {
      namespace: mockNamespace,
    },
  },
  result: {
    data: {
      services: [service1, service2],
    },
  },
};

export const idpPresetsQuery = {
  request: {
    query: GET_IDP_PRESETS,
  },
  result: {
    data: {
      IDPPresets: [
        {
          name: 'preset-1',
          issuer: 'https://dex.kyma.local',
          jwksUri:
            'https://http://dex-service.kyma-system.svc.cluster.local:5556/keys',
          __typename: 'IDPPreset',
        },
      ],
    },
  },
};
