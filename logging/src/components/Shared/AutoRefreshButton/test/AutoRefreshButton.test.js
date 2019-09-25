import React from 'react';
import renderer from 'react-test-renderer';
import AutoRefreshButton from './../AutoRefreshButton';
import {
  SearchParamsContext,
  defaultSearchParams,
  actions,
  SET_AUTO_REFRESH,
} from '../../../Logs/SearchParams.reducer';
import { mount } from 'enzyme';

describe('AutoRefreshButton', () => {
  it('Renders in paused state', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[
          { ...defaultSearchParams, autoRefreshEnabled: false },
          actions(jest.fn()),
        ]}
      >
        <AutoRefreshButton />
      </SearchParamsContext.Provider>,
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders in enabled state', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[defaultSearchParams, actions(jest.fn())]}
      >
        <AutoRefreshButton />
      </SearchParamsContext.Provider>,
    );
    expect(component).toMatchSnapshot();
  });

  it('Clicking button triggers callback', () => {
    const callbackMock = jest.fn();
    const component = mount(
      <SearchParamsContext.Provider
        value={[defaultSearchParams, actions(callbackMock)]}
      >
        <AutoRefreshButton />
      </SearchParamsContext.Provider>,
    );

    component.simulate('click');

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith({
      type: SET_AUTO_REFRESH,
      value: !defaultSearchParams.autoRefreshEnabled,
    });
  });
});
