import { GET_LAMBDAS, GET_SERVICES } from '../gql/queries';
import { DELETE_LAMBDA, CREATE_API_RULE } from '../gql/mutations';
import { lambda1, lambda2, deletedLambda1 } from './lambdaMocks';
import { service1, service2 } from './servicesMocks';

import builder from '../commons/builder';

export const allLambdasQuery = {
  request: {
    query: GET_LAMBDAS,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
  },
  result: {
    data: {
      functions: [lambda1, lambda2],
    },
  },
};

export const deleteLambdaMutation = {
  request: {
    query: DELETE_LAMBDA,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      name: 'demo',
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      deleteFunction: deletedLambda1,
    },
  }),
};

export const servicesQuery = {
  request: {
    query: GET_SERVICES,
    variables: {
      namespace: 'test',
    },
  },
  result: {
    data: {
      services: [service1, service2],
    },
  },
};

const createdAPIRule = {
  name: 'test',
};

const sampleAPIRule = {
  name: 'test-123',
  namespace: 'test',
  params: {
    host: 'host-1.2.3.kyma.local',
    serviceName: 'test',
    servicePort: '80',
    gateway: 'kyma-gateway.kyma-system.svc.cluster.local',
    rules: [
      {
        path: '/.*',
        methods: ['PUT', 'POST', 'GET', 'DELETE'],
        accessStrategies: [
          {
            name: 'allow',
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
