import React from 'react';
import renderer from 'react-test-renderer';

import { ServiceBindingsService } from '../ServiceBindingsService';

describe('ServiceBindingsService', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <ServiceBindingsService lambdaName="foobar">
        <div>foobar</div>
      </ServiceBindingsService>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
