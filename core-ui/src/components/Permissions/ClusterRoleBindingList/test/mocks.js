import { GET_CLUSTER_ROLES, GET_CLUSTER_ROLE_BINDINGS } from 'gql/queries';
import { CREATE_CLUSTER_ROLE_BINDING } from 'gql/mutations';

export const clusterRolesQueryMock = {
  request: { query: GET_CLUSTER_ROLES },
  result: {
    data: {
      clusterRoles: [{ name: 'cluster-role-1' }],
    },
  },
};

export const mutationMock = {
  request: {
    query: CREATE_CLUSTER_ROLE_BINDING,
    variables: {
      name: 'user-cluster-role-1',
      params: {
        roleName: 'cluster-role-1',
        subjects: [{ name: 'user', kind: 'User' }],
      },
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      createClusterRoleBinding: {
        name,
      },
    },
  }),
};

export const clusterRoleBindingsQueryMock = {
  request: { query: GET_CLUSTER_ROLE_BINDINGS },
  result: {
    data: {
      clusterRoleBindings: [
        {
          name: 'cluster-role-binding-1',
          roleRef: { name: 'role' },
        },
        {
          name: 'cluster-role-binding-2',
          roleRef: { name: 'role' },
        },
      ],
    },
  },
};
