import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import DropdownRenderer from './../DropdownRenderer';

const mockRecentLabels = ['a', 'b'];

const mockLogLabels = [
  {
    name: 'name',
    labels: [['c', 'd']],
  },
];

describe('DropdownRenderer', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <DropdownRenderer
        recentLabels={mockRecentLabels}
        logLabels={mockLogLabels}
        chooseLabel={() => {}}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Shows "No log labels" text when there is no log labels', () => {
    const component = shallow(
      <DropdownRenderer
        recentLabels={mockRecentLabels}
        logLabels={[]}
        chooseLabel={() => {}}
      />,
    );
    expect(component.find('button[data-test-id="no-log-labels"]')).toBeTruthy();
  });

  it('Shows "No recent labels" text when there is no recent labels', () => {
    const component = shallow(
      <DropdownRenderer
        recentLabels={[]}
        logLabels={mockLogLabels}
        chooseLabel={() => {}}
      />,
    );
    expect(
      component.find('button[data-test-id="no-recent-labels"]'),
    ).toBeTruthy();
  });
});
