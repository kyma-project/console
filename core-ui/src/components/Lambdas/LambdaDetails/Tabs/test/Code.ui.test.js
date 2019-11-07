import React from 'react';
import renderer from 'react-test-renderer';

import Code from '../Code';

describe('Lambda Code Tab', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(<Code contentRef={{ current: null }} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Render example code', () => {
    const component = renderer.create(
      <Code contentRef={{ current: null }} lambdaCode="echo" />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
