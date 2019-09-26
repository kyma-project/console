import React from 'react';
import renderer from 'react-test-renderer';
import ResultsOptionsDropdown from './../ResultsOptionsDropdown';
import {
  SearchParamsContext,
  defaultSearchParams,
  actions,
} from '../../../Logs/SearchParams.reducer';

describe('ResultsOptionsDropdown', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[defaultSearchParams, actions(jest.fn())]}
      >
        <ResultsOptionsDropdown />
      </SearchParamsContext.Provider>,
    );
    expect(component).toMatchSnapshot();
  });
});
