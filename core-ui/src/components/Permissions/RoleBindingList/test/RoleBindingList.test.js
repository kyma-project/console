import React from 'react';
import { render } from '@testing-library/react';
import RoleBindingList from '../RoleBindingList';
import { MockedProvider } from '@apollo/react-testing';

import { GET_ROLE_BINDINGS } from 'gql/queries';

const namespace = 'test-namespace';
const roleBindingsQueryMock = {
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

describe('RoleBindingList', () => {
  it('Renders with minimal props', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[roleBindingsQueryMock]}>
        <RoleBindingList namespaceId={namespace} />
      </MockedProvider>,
    );

    expect(await findByText('role-binding-1')).toBeInTheDocument();
    expect(await findByText('role-binding-2')).toBeInTheDocument();
  });
});
