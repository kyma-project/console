import React from 'react';
import { render } from '@testing-library/react';
import RoleBindingList from '../RoleBindingList';
import { MockedProvider } from '@apollo/react-testing';

import { namespace, roleBindingsQueryMock } from './mocks';

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
