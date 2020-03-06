import React from 'react';
import renderer from 'react-test-renderer';

import Checkbox from '../Checkbox';

describe('<Checkbox />', () => {
  const checkbox = <Checkbox value="Foo bar" />;

  it('Renders with minimal props', () => {
    const component = renderer.create(checkbox);
    expect(component).toBeTruthy();
  });
});
