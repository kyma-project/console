import React from 'react';
import renderer from 'react-test-renderer';

import NamespaceFilters from './../NamespaceFilters';

describe('NamespaceFilters', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <NamespaceFilters
        filters={[{ name: '1', name: '2' }]}
        updateFilters={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
