import { DELETE_NAMESPACE } from 'gql/mutations';

export const mockNavigate = jest.fn();

export const deleteNamespaceMock = {
  request: {
    query: DELETE_NAMESPACE,
    variables: {
      name: 'test',
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      deleteNamespace: {
        name: 'test',
      },
    },
  }),
};
