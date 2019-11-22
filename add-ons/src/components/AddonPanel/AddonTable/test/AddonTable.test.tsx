import React from 'react';
import AddonTable from './../AddonTable';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Configuration, RepositoryStatus } from '../../../../types';

const repositoryMock: RepositoryStatus = {
  url: 'url',
  status: 'ready',
  reason: '',
  message: '',
  addons: [],
};

const configMock: Configuration = {
  name: 'configuration',
  urls: [],
  labels: {},
  repositories: [],
  status: {
    phase: 'ready',
    repositories: [repositoryMock],
  },
};

describe('AddonTable', () => {
  it('Renders with minimal props', () => {
    const component = shallow(<AddonTable config={configMock} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
