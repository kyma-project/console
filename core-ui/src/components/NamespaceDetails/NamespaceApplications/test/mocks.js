import { UNBIND_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

export const namespace = {
  name: 'ns',
  labels: {},
  applications: ['app 1', 'app 2'],
};

export const unbindNamespace = {
  request: {
    query: UNBIND_NAMESPACE,
    variables: {
      namespace: namespace.name,
      application: namespace.applications[0],
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      disableApplication: {
        namespace: namespace.name,
        application: namespace.applications[0],
      },
    },
  }),
};

export const getNamespace = {
  request: {
    query: GET_NAMESPACE,
    variables: {
      name: namespace.name,
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      namespace,
    },
  }),
};
