import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import SearchInput from './../SearchInput';

describe('SearchInput', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchInput
        searchPhrase="search phrase"
        updateFilteringState={() => {}}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
