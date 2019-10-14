import { GET_LAMBDAS } from '../gql/queries';
import { DELETE_LAMBDA } from '../gql/mutations';
import { lambda1, lambda2, deletedLambda1 } from './lambdaMocks';

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
