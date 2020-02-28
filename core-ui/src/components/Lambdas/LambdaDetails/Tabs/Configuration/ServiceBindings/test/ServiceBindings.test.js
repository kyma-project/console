import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import ServiceBindings from '../ServiceBindings';

describe('ServiceBindings', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <ServiceBindings
          injectedServiceInstances={[]}
          notInjectedServiceInstances={[]}
          refetchQuery={() => {}}
        />
      </MockedProvider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
