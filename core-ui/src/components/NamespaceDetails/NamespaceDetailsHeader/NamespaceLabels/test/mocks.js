import { UPDATE_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

export const namespaceMock = { name: 'ns', labels: { a: 'b', c: 'd' } };

export const updateNamespaceMock = {
  request: {
    query: UPDATE_NAMESPACE,
    variables: {
      name: namespaceMock.name,
      labels: {
        c: 'd',
        e: 'f',
      },
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      updateNamespace: {
        name: namespaceMock.name,
        labels: {
          c: 'd',
          e: 'f',
        },
      },
    },
  }),
};

export const getNamespaceMock = {
  request: {
    query: GET_NAMESPACE,
    variables: {
      name: namespaceMock.name,
    },
  },
  result: {
    data: {
      namespace: { ...namespaceMock, applications: [] },
    },
  },
};
