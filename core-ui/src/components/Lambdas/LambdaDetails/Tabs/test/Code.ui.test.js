import React from 'react';
import renderer from 'react-test-renderer';

import Code from '../Code';

describe('Lambda Code Tab', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <Code lambdaCode="code" setLambdaCode={() => {}} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
