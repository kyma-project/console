import React from 'react';
import { render } from '@testing-library/react';
import RoleDetails from '../RoleDetails';
import { MockedProvider } from '@apollo/react-testing';

import { GET_ROLE } from 'gql/queries';

const namespace = 'test-namespace';
const name = 'test-name';
const roleQueryMock = {
  request: { query: GET_ROLE, variables: { namespace, name } },
  result: {
    data: {
      role: {
        name,
        rules: [
          {
            apiGroups: ['a', ''],
            resources: ['res1', 'res2'],
            verbs: ['get'],
          },
        ],
      },
    },
  },
};

describe('RoleDetails', () => {
  it('Renders with minimal props', async () => {
    const { findByText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[roleQueryMock]}>
        <RoleDetails roleName={name} namespaceId={namespace} />
      </MockedProvider>,
    );

    expect(queryByText(namespace)).toBeInTheDocument();
    expect(await findByText('a, /api/v1')).toBeInTheDocument();
    expect(await findByText('res1, res2')).toBeInTheDocument();
    expect(await findByText('get')).toBeInTheDocument();
  });
});
