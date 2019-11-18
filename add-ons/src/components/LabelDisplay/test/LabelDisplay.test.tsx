import React from 'react';
import LabelDisplay from './../LabelDisplay';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const mockLabels = {
  a: 1,
  b: 2,
};

const mockReadonlyLabels = {
  aR: 'a',
  bR: 'b',
};

describe('LabelDisplay', () => {
  it('Renders with minimal props', () => {
    const component = mount(<LabelDisplay />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders labels', () => {
    const component = mount(
      <LabelDisplay readonlyLabels={mockReadonlyLabels} labels={mockLabels} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
