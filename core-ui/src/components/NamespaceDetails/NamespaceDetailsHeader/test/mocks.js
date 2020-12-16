import { DELETE_NAMESPACE } from 'gql/mutations';

export const namespace = {
  name: 'namespace',
  labels: {
    a: 'b',
    c: 'd',
  },
  deployments: [],
  pods: [],
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
