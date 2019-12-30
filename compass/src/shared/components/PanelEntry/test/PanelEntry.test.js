import React from 'react';
import renderer from 'react-test-renderer';
import PanelEntry from '../PanelEntry.component';

describe('PanelEntry', () => {
  it(`Renders title and children`, () => {
    const component = renderer.create(
      <PanelEntry title="testtitle" children="testcontent" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
