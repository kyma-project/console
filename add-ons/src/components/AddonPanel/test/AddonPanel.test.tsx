import React from 'react';
import AddonPanel from './../AddonPanel';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Configuration } from '../../../types';

const configMock: Configuration = {
  name: 'configuration',
  urls: [],
  labels: {},
  repositories: [],
  status: {
    phase: 'ready',
    repositories: [],
  },
};

describe('AddonPanel', () => {
  it('Renders with minimal props', () => {
    const component = shallow(<AddonPanel config={configMock} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
