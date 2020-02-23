import React from 'react';
import renderer from 'react-test-renderer';

import ServiceBindings from '../ServiceBindings';

describe('ServiceBindings', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <ServiceBindings
        injectedServiceInstances={[]}
        notInjectedServiceInstances={[]}
        refetchQuery={() => {}}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
