import React from 'react';
import renderer from 'react-test-renderer';
import AutoRefreshButton from './../AutoRefreshButton';

describe('AutoRefreshButton', () => {
  it('Renders in paused state', () => {
    const component = renderer.create(
      <AutoRefreshButton
        autoRefreshEnabled={false}
        updateParentState={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders in enabled state', () => {
    const component = renderer.create(
      <AutoRefreshButton
        autoRefreshEnabled={true}
        updateParentState={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
