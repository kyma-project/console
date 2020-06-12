import { DELETE_NAMESPACE } from 'gql/mutations';

export const namespace = {
  name: 'ns',
  labels: {
    a: 'b',
    c: 'd',
  },
};

export const deleteNamespaceMock = {
  request: {
    query: DELETE_NAMESPACE,
    variables: {
      name: namespace.name,
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      deleteNamespace: {
        name: namespace.name,
      },
    },
  }),
};
