import React from 'react';
import renderer from 'react-test-renderer';
import CompactHeader from './../CompactHeader';
import {
  SearchParamsContext,
  defaultSearchParams,
  actions,
} from '../../Logs/SearchParams.reducer';

describe('CompactHeader', () => {
  console.error = jest.fn();
  const dispatch = jest.fn();

  afterEach(() => {
    console.error.mockReset();
    dispatch.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
  });

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[defaultSearchParams, actions(dispatch)]}
      >
        <CompactHeader />
      </SearchParamsContext.Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
