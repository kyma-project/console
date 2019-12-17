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
