import React from 'react';
import { shallow } from 'enzyme';
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
    const component = shallow(
      <DropdownRenderer
        recentLabels={[]}
        logLabels={mockLogLabels}
        chooseLabel={() => {}}
      />,
    );

    const link = component.find('span[aria-haspopup="true"]').first();

    link.simulate('click');
    expect(toJson(component)).toMatchSnapshot();

    link.simulate('click');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Click on subitem triggers callback', async () => {
    const mockCallback = jest.fn();
    const component = shallow(
      <DropdownRenderer
        recentLabels={mockRecentLabels}
        logLabels={[]}
        chooseLabel={mockCallback}
      />,
    );

    const link = component.find('span.fd-mega-menu__link').first();

    link.simulate('click');

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
