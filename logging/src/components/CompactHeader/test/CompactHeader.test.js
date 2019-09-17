import React from 'react';
import renderer from 'react-test-renderer';
import CompactHeader from './../CompactHeader';
import { DEFAULT_PERIOD, SORT_ASCENDING } from '../../../constants';

describe('CompactHeader', () => {
  console.error = jest.fn();

  afterEach(() => {
    console.error.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
  });

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <CompactHeader
        updateFilteringState={() => {}}
        searchPhrase="search phrase"
        logsPeriod={DEFAULT_PERIOD}
        sortDirection={SORT_ASCENDING}
        advancedSettings={{}}
        autoRefreshEnabled={false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
