import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import LabelsDisplay from './../LabelsDisplay';

describe('LabelDisplay', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <LabelsDisplay
        labels={['a', 'b']}
        readonlyLabels={['c', 'd']}
        removeLabel={() => {}}
        removeAll={() => {}}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Does not show "Clear All" button when labels are not provided', () => {
    const component = shallow(
      <LabelsDisplay
        labels={[]}
        readonlyLabels={[]}
        removeLabel={() => {}}
        removeAll={() => {}}
      />,
    );
    expect(component.exists('span[data-test-id="clear-all"]')).not.toBeTruthy();
  });
});
