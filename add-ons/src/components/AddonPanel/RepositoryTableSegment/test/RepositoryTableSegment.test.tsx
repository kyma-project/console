import React from 'react';
import RepositoryTableSegment from './../RepositoryTableSegment';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RepositoryStatus } from '../../../../types';

const repositoryMock: RepositoryStatus = {
  url: 'url',
  status: 'ready',
  reason: '',
  message: '',
  addons: [],
};

describe('RepositoryTableSegment', () => {
  it('Renders with minimal props', () => {
    const component = shallow(
      <RepositoryTableSegment
        repository={repositoryMock}
        configName="config name"
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
