import React from 'react';
import InlineHelp from './../InlineHelp';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('InlineHelp', () => {
  it('Renders with minimal props', () => {
    const component = shallow(<InlineHelp text="sample text" />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
