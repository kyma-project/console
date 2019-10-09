import { GET_LAMBDAS } from '../gql/queries';
import { lambda1, lambda2 } from './lambdaMocks';

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
