import React from 'react';
import Toolbar from './../Toolbar.component';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Toolbar', () => {
  let useContextMock: any;
  let originalUseContext: any;

  beforeEach(() => {
    useContextMock = React.useContext = jest.fn();
    originalUseContext = React.useContext;
  });

  afterEach(() => {
    React.useContext = originalUseContext;
  });

  it('Renders cluster addons title', () => {
    useContextMock.mockReturnValue({}); // namespaceId is not defined in cluster view

    const component = shallow(<Toolbar />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Renders namespaced addons title', () => {
    useContextMock.mockReturnValue({ namespaceId: 'namespace' });

    const component = shallow(<Toolbar />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
