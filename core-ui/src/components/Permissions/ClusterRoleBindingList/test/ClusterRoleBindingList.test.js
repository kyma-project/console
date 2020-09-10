import React from 'react';
import { render } from '@testing-library/react';
import ClusterRoleBindingList from '../ClusterRoleBindingList';
import { MockedProvider } from '@apollo/react-testing';

import { clusterRoleBindingsQueryMock } from './mocks';

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
