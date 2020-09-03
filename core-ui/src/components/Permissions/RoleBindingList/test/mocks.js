import { GET_CLUSTER_ROLES, GET_ROLES, GET_ROLE_BINDINGS } from 'gql/queries';
import { CREATE_ROLE_BINDING } from 'gql/mutations';

export const namespace = 'test-namespace';

export const clusterRolesQueryMock = {
  request: { query: GET_CLUSTER_ROLES },
  result: {
    data: {
      clusterRoles: [{ name: 'cluster-role-1' }],
    },
  },
};

export const rolesQueryMock = {
  request: { query: GET_ROLES, variables: { namespace } },
  result: { data: { roles: [{ name: 'role-1' }] } },
};

export const mutationMock = {
  request: {
    query: CREATE_ROLE_BINDING,
    variables: {
      name: 'user-role-1',
      namespace,
      params: {
        roleName: 'role-1',
        roleKind: 'Role',
        subjects: [{ name: 'user', kind: 'User' }],
      },
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      createRoleBinding: {
        name,
      },
    },
  }),
};

export const roleBindingsQueryMock = {
  request: { query: GET_ROLE_BINDINGS, variables: { namespace: namespace } },
  result: {
    data: {
      roleBindings: [
        {
          name: 'role-binding-1',
          roleRef: { name: 'role', kind: 'Role' },
        },
        {
          name: 'role-binding-2',
          roleRef: { name: 'role', kind: 'Role' },
        },
      ],
    },
  },
};
