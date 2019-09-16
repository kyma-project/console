import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import DropdownRenderer from './../DropdownRenderer';

const mockRecentLabels = ['a', 'b'];

const mockLogLabels = [
  {
    name: 'name 1',
  },
  {
    name: 'name 2',
  },
];

describe('DropdownRenderer', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <DropdownRenderer
        recentLabels={mockRecentLabels}
        logLabelCategories={mockLogLabels}
        chooseLabel={() => {}}
        loadLabels={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Shows "No log labels" text when there is no log labels', () => {
    const component = mount(
      <DropdownRenderer
        recentLabels={mockRecentLabels}
        logLabelCategories={[]}
        chooseLabel={() => {}}
        loadLabels={() => {}}
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
        logLabelCategories={mockLogLabels}
        chooseLabel={() => {}}
        loadLabels={() => {}}
      />,
    );
    expect(
      component.containsMatchingElement(
        <span data-test-id="no-recent-labels"> No recent labels </span>,
      ),
    ).toBe(true);
  });
});
