import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import SearchInput from './../SearchInput';
import {
  SearchParamsContext,
  defaultSearchParams,
  actions,
  SET_SEARCH_PHRASE,
} from '../../../Logs/SearchParams.reducer';
describe('SearchInput', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[{ ...defaultSearchParams }, actions(jest.fn())]}
      >
        <SearchInput />
      </SearchParamsContext.Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders in compact mode', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[{ ...defaultSearchParams }, actions(jest.fn())]}
      >
        <SearchInput compact={true} />
      </SearchParamsContext.Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Entering text triggers callback', async () => {
    const mockCallback = jest.fn();
    const component = mount(
      <SearchParamsContext.Provider
        value={[{ ...defaultSearchParams }, actions(mockCallback)]}
      >
        <SearchInput />
      </SearchParamsContext.Provider>,
    );

    component
      .find('#search-input')
      .simulate('change', { target: { value: 't' } });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      type: SET_SEARCH_PHRASE,
      value: 't',
    });
  });
});
