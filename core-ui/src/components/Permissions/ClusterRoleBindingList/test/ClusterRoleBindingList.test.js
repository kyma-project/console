import React from 'react';
import { render } from '@testing-library/react';
import ClusterRoleBindingList from '../ClusterRoleBindingList';
import { MockedProvider } from '@apollo/react-testing';

import { GET_CLUSTER_ROLE_BINDINGS } from 'gql/queries';

const clusterRoleBindingsQueryMock = {
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

describe('ClusterRoleBindingList', () => {
  it('Renders with minimal props', async () => {
    const { findByText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[clusterRoleBindingsQueryMock]}
      >
        <ClusterRoleBindingList />
      </MockedProvider>,
    );

    expect(await findByText('cluster-role-binding-1')).toBeInTheDocument();
    expect(await findByText('cluster-role-binding-2')).toBeInTheDocument();
  });
});
