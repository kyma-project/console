import React from 'react';
import { render } from '@testing-library/react';
import ClusterRoleDetails from '../ClusterRoleDetails';
import { MockedProvider } from '@apollo/react-testing';

import { GET_CLUSTER_ROLE } from 'gql/queries';

const name = 'test-name';
const clusterRoleQueryMock = {
  request: { query: GET_CLUSTER_ROLE, variables: { name } },
  result: {
    data: {
      clusterRole: {
        name,
        rules: [
          {
            apiGroups: ['b', ''],
            resources: ['res1', 'res2'],
            verbs: ['get'],
          },
        ],
      },
    },
  },
};

describe('ClusterRoleDetails', () => {
  it('Renders with minimal props', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[clusterRoleQueryMock]}>
        <ClusterRoleDetails roleName={name} />
      </MockedProvider>,
    );

    expect(await findByText('b, /api/v1')).toBeInTheDocument();
    expect(await findByText('res1, res2')).toBeInTheDocument();
    expect(await findByText('get')).toBeInTheDocument();
  });
});
