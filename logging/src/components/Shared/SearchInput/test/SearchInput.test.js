import React from 'react';
import renderer from 'react-test-renderer';
import SearchInput from './../SearchInput';

describe('SearchInput', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchInput
        searchPhrase="search phrase"
        updateFilteringState={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders in compact mode', () => {
    const component = renderer.create(
      <SearchInput
        searchPhrase="search phrase"
        updateFilteringState={() => {}}
        compact={true}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
