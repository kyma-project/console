import React from 'react';
import AddonList from './../AddonList';
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

describe('AddonList', () => {
  // mock QueriesService and ConfigurationService
  let useContextMock: any;
  let originalUseContext: any;

  beforeEach(() => {
    useContextMock = React.useContext = jest.fn();
    originalUseContext = React.useContext;
  });

  afterEach(() => {
    React.useContext = originalUseContext;
  });

  it('Renders loading state', () => {
    useContextMock
      .mockReturnValueOnce({ error: null, loading: true })
      .mockReturnValueOnce({ configurationsExist: null, filteredConfigs: [] });

    const component = shallow(<AddonList />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders "resource not found" when configuration does not exist after load', () => {
    useContextMock
      .mockReturnValueOnce({ error: null, loading: false })
      .mockReturnValueOnce({
        configurationsExist: () => false,
        filteredConfigs: [],
      });

    const component = shallow(<AddonList />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders error there is a query error', () => {
    useContextMock
      .mockReturnValueOnce({ error: 'error!', loading: false })
      .mockReturnValueOnce({
        configurationsExist: () => true,
        filteredConfigs: [],
      });

    const component = shallow(<AddonList />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders empty list when there are no configs', () => {
    useContextMock
      .mockReturnValueOnce({ error: null, loading: false })
      .mockReturnValueOnce({
        configurationsExist: () => true,
        filteredConfigs: [],
      });

    const component = shallow(<AddonList />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders addon list', () => {
    useContextMock
      .mockReturnValueOnce({ error: null, loading: false })
      .mockReturnValueOnce({
        configurationsExist: () => true,
        filteredConfigs: [configMock],
      });

    const component = shallow(<AddonList />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
