import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
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
    const component = mount(
      <DropdownRenderer
        recentLabels={mockRecentLabels}
        logLabels={[]}
        chooseLabel={() => {}}
      />,
    );
    expect(
      component.containsMatchingElement(
        <span data-test-id="no-log-labels">No log labels</span>,
      ),
    ).toBe(true);
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
      component.containsMatchingElement(
        <span data-test-id="no-recent-labels"> No recent labels </span>,
      ),
    ).toBe(true);
  });
});
