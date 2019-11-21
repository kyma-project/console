import React from 'react';
import renderer from 'react-test-renderer';

import LambdaDependencies from '../LambdaDependencies';

describe('Lambda Dependencies', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <LambdaDependencies
        dependencies="dependencies"
        setDependencies={() => {}}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
