import React from 'react';
import renderer from 'react-test-renderer';

import NamespacesListHeader from './../NamespacesListHeader';

describe('NamespacesListHeader UI', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <NamespacesListHeader
        labelFilters={[{ name: '1' }, { name: '2' }]}
        updateSearchPhrase={() => {}}
        setLabelFilters={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
