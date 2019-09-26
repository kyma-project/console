import React from 'react';
import { mount } from 'enzyme';
import DropdownRenderer from './../DropdownRenderer';
import toJson from 'enzyme-to-json';

const mockRecentLabels = ['a', 'b'];

const mockLogLabels = [
  {
    name: 'name',
    labels: [['c', 'd']],
  },
  {
    name: 'name 2',
    labels: [['e', 'f']],
  },
];

describe('DropdownRenderer UI', () => {
  it('Shows / hides nested list when parent its parent is clicked', () => {
    const component = mount(
      <DropdownRenderer
        selectedLabels={[]}
        recentLabels={[]}
        logLabelCategories={mockLogLabels}
        chooseLabel={() => {}}
        loadLabels={() => {}}
      />,
    );

    const link = component.find('span[aria-haspopup="true"]').first();

    link.simulate('click');
    expect(toJson(component)).toMatchSnapshot();

    link.simulate('click');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Click on recent list item triggers callback', async () => {
    const mockCallback = jest.fn();
    const component = mount(
      <DropdownRenderer
        selectedLabels={[]}
        recentLabels={mockRecentLabels}
        logLabelCategories={mockLogLabels}
        chooseLabel={mockCallback}
        loadLabels={() => {}}
      />,
    );

    const link = component.find('span.fd-mega-menu__link').first();

    link.simulate('click');

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('Click on category triggers callback', async () => {
    const mockCallback = jest.fn();
    const component = mount(
      <DropdownRenderer
        selectedLabels={[]}
        recentLabels={mockRecentLabels}
        logLabelCategories={mockLogLabels}
        chooseLabel={mockCallback}
        loadLabels={() => {}}
      />,
    );

    const link = component.find('span.fd-mega-menu__link').first();

    link.simulate('click');

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
