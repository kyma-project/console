import React from 'react';
import renderer from 'react-test-renderer';

import LambdaCode from '../LambdaCode';

describe('Lambda Code', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <LambdaCode code="code" setCode={() => {}} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
