import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ClusterRoleList from '../ClusterRoleList';
import { MockedProvider } from '@apollo/react-testing';

import { GET_CLUSTER_ROLES } from 'gql/queries';

const clusterRolesQueryMock = {
  request: { query: GET_CLUSTER_ROLES },
  result: {
    data: {
      clusterRoles: [{ name: 'cluster-role-1' }, { name: 'cluster-role-2' }],
    },
  },
};

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({ navigate: mockNavigate }),
}));

describe('ClusterRoleList', () => {
  it('Renders roles', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[clusterRolesQueryMock]}>
        <ClusterRoleList />
      </MockedProvider>,
    );

    expect(await findByText('cluster-role-1')).toBeInTheDocument();
    expect(await findByText('cluster-role-2')).toBeInTheDocument();
  });

  it('Callbacks on role click', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[clusterRolesQueryMock]}>
        <ClusterRoleList />
      </MockedProvider>,
    );

    fireEvent.click(await findByText('cluster-role-1'));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/home/global-permissions/roles/cluster-role-1',
    );
  });
});
