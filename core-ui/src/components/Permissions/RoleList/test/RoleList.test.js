import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RoleList from '../RoleList';
import { MockedProvider } from '@apollo/react-testing';

import { GET_ROLES } from 'gql/queries';

const namespace = 'test-namespace';

const rolesQueryMock = {
  request: {
    query: GET_ROLES,
    variables: { namespace },
  },
  result: {
    data: {
      roles: [{ name: 'role-1' }, { name: 'role-2' }],
    },
  },
};

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({ navigate: mockNavigate }),
}));

describe('RoleList', () => {
  it('Renders roles', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[rolesQueryMock]}>
        <RoleList namespaceId={namespace} />
      </MockedProvider>,
    );

    expect(await findByText('role-1')).toBeInTheDocument();
    expect(await findByText('role-2')).toBeInTheDocument();
  });

  it('Callbacks on role click', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[rolesQueryMock]}>
        <RoleList namespaceId={namespace} />
      </MockedProvider>,
    );

    fireEvent.click(await findByText('role-1'));

    expect(mockNavigate).toHaveBeenCalledWith('roles/role-1');
  });
});
