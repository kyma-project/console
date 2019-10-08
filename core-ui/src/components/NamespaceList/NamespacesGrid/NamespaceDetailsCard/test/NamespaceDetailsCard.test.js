import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import NamespaceDetailsCard from './../NamespaceDetailsCard';

describe('NamespaceDetailsCard', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <NamespaceDetailsCard
          namespaceName={'test'}
          allPodsCount={10}
          healthyPodsCount={10}
          status={'Active'}
          isSystemNamespace={false}
          applicationsCount={0}
        />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays "SYSTEM" badge', () => {
    const component = renderer.create(
      <MockedProvider>
        <NamespaceDetailsCard
          namespaceName={'test'}
          allPodsCount={10}
          healthyPodsCount={10}
          status={'Active'}
          isSystemNamespace={true}
          applicationsCount={0}
        />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays overlay when status is "Terminating"', () => {
    const component = renderer.create(
      <MockedProvider>
        <NamespaceDetailsCard
          namespaceName={'test'}
          allPodsCount={10}
          healthyPodsCount={10}
          status={'Terminating'}
          isSystemNamespace={false}
          applicationsCount={0}
        />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
