import React from 'react';
import { render } from '@testing-library/react';

import NamespacesGrid from './../NamespacesGrid';

const sampleNamespaces = [
  {
    name: 'first-namespace',
    status: 'Active',
    pods: [{ status: 'ACTIVE' }],
    isSystemNamespace: false,
    applications: [{}, {}],
  },
  {
    name: 'second-namespace',
    status: 'Active',
    pods: [{ status: 'ACTIVE' }],
    isSystemNamespace: true,
    applications: [{}, {}, {}],
  },
];

describe('NamespaceGrid', () => {
  it('Renders namespaces', () => {
    const { queryByText, queryAllByRole } = render(
      <NamespacesGrid namespaces={sampleNamespaces} />,
    );

    expect(queryAllByRole('gridcell').length).toBe(2);
    expect(queryByText('first-namespace')).toBeInTheDocument();
    expect(queryByText('second-namespace')).toBeInTheDocument();
  });
});
