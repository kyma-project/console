import React from 'react';
import renderer from 'react-test-renderer';
import ResultsOptionsDropdown from './../ResultsOptionsDropdown';

describe('ResultsOptionsDropdown', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <ResultsOptionsDropdown
        advancedSettings={{}}
        updateFilteringState={() => {}}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
