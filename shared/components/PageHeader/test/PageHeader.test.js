import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  it('Renders with minimal props', () => {
    const component = shallow(<PageHeader title="page title" />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
