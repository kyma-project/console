import React from 'react';
import { render } from '@testing-library/react';

import NamespacesGrid from './../NamespacesGrid';

const sampleNamespaces = [
  {
    name: 'first-namespace',
    status: 'Active',
    allPodsCount: 3,
    healthyPodsCount: 2,
    isSystemNamespace: false,
    applications: 2,
  },
  {
    name: 'second-namespace',
    status: 'Active',
    allPodsCount: 4,
    healthyPodsCount: 3,
    isSystemNamespace: true,
    applications: 3,
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
