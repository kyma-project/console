import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RoleCombobox from '../RoleCombobox';
import { MockedProvider } from '@apollo/react-testing';
import { ignoreConsoleErrors } from 'setupTests';

import { GET_ROLES, GET_CLUSTER_ROLES } from 'gql/queries';

const namespace = 'test-namespace';

const clusterRolesQueryMock = {
  request: { query: GET_CLUSTER_ROLES },
  result: {
    data: {
      clusterRoles: [{ name: 'cluster-role-1' }, { name: 'cluster-role-2' }],
    },
  },
};

const rolesQueryMock = {
  request: { query: GET_ROLES, variables: { namespace } },
  result: { data: { roles: [{ name: 'role-1' }] } },
};

describe('RoleCombobox', () => {
  ignoreConsoleErrors(['Warning: `NaN` is an invalid value for the']); // ignore Popover error

  it('Renders roles and cluster roles', async () => {
    const { findByPlaceholderText, queryByText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[clusterRolesQueryMock, rolesQueryMock]}
      >
        <RoleCombobox setRole={() => {}} namespaceId={namespace} />
      </MockedProvider>,
    );

    fireEvent.click(await findByPlaceholderText('Choose role...'));

    expect(queryByText('role-1')).toBeInTheDocument();
    expect(queryByText('cluster-role-1')).toBeInTheDocument();
    expect(queryByText('cluster-role-2')).toBeInTheDocument();
  });

  it('Callbacks on click', async () => {
    const callback = jest.fn();
    const { findByPlaceholderText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[clusterRolesQueryMock]}>
        <RoleCombobox setRole={callback} />
      </MockedProvider>,
    );

    fireEvent.click(await findByPlaceholderText('Choose role...'));

    fireEvent.click(queryByText('cluster-role-1'));
    expect(callback).toHaveBeenCalledWith('cluster-role-1', 'ClusterRole');
  });

  it('Does not render roles if namespaceId is not passed', async () => {
    const { findByPlaceholderText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[clusterRolesQueryMock]}>
        <RoleCombobox setRole={() => {}} />
      </MockedProvider>,
    );

    fireEvent.click(await findByPlaceholderText('Choose role...'));

    expect(queryByText('role-1')).not.toBeInTheDocument();
    expect(queryByText('cluster-role-1')).toBeInTheDocument();
  });
});
