import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import NamespacesGrid from './../NamespacesGrid';

const sampleNamespaces = [
  {
    name: 'a',
    status: 'Active',
    pods: [{ status: 'ACTIVE' }],
    isSystemNamespace: false,
    applications: [{}, {}],
  },
  {
    name: 'b',
    status: 'Active',
    pods: [{ status: 'ACTIVE' }],
    isSystemNamespace: true,
    applications: [{}, {}, {}],
  },
];

describe('NamespaceGrid', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <NamespacesGrid namespaces={sampleNamespaces} />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
