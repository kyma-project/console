import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import * as mockData from './mockData';
import MultiChoiceList from '../MultiChoiceList.component';

describe('MultiChoiceList', () => {
  // for "Warning: componentWillMount has been renamed"
  console.error = jest.fn();
  console.warn = jest.fn();

  afterEach(() => {
    console.error.mockReset();
    console.warn.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    if (console.warn.mock.calls.length) {
      expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
    }
  });

  it('Renders empty list with default caption props', () => {
    const component = renderer.create(
      <MultiChoiceList
        updateItems={() => {}}
        currentlySelectedItems={[]}
        currentlyNonSelectedItems={[]}
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Renders empty list with custom caption props', () => {
    const component = renderer.create(
      <MultiChoiceList
        updateItems={() => {}}
        currentlySelectedItems={[]}
        currentlyNonSelectedItems={[]}
        placeholder="placeholder value"
        notSelectedMessage="not assigned message"
        noEntitiesAvailableMessage="no entities available message"
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Renders two lists of simple items', () => {
    console.error = jest.fn();

    const component = renderer.create(
      <MultiChoiceList
        updateItems={() => {}}
        currentlySelectedItems={mockData.simpleSelected}
        currentlyNonSelectedItems={mockData.simpleNonselected}
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();

    // catch "Warning: Each child in a list should have a unique \"key\" prop." comming from Fundamental
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Renders two lists of object items', () => {
    const component = renderer.create(
      <MultiChoiceList
        updateItems={() => {}}
        currentlySelectedItems={mockData.selectedObjects}
        currentlyNonSelectedItems={mockData.nonSelectedObjects}
        displayPropertySelector="name"
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Calls updateItems when user clicks on selected items list', () => {
    const updateItems = jest.fn();

    const component = mount(
      <MultiChoiceList
        updateItems={updateItems}
        currentlySelectedItems={['a', 'b']}
        currentlyNonSelectedItems={[]}
      />,
    );

    const removeItemButton = component
      .find('.multi-choice-list__list-element')
      .filterWhere(n => n.text() === 'a')
      .find('button[data-test-id="unselect-button"]');

    removeItemButton.simulate('click');

    expect(updateItems).toHaveBeenCalledWith(['b'], ['a']);
  });

  it('Calls updateItems when user clicks on non selected items list', () => {
    const updateItems = jest.fn();

    const component = mount(
      <MultiChoiceList
        updateItems={updateItems}
        currentlySelectedItems={[]}
        currentlyNonSelectedItems={['b', 'a']}
      />,
    );

    // expand list
    const popoverControl = component.find('.fd-button.fd-dropdown__control');
    popoverControl.simulate('click');

    component.update();

    const addItemButton = component
      .find('span[data-test-id="select-button"]')
      .filterWhere(n => n.text() === 'a');

    addItemButton.simulate('click');

    expect(updateItems).toHaveBeenCalledWith(['a'], ['b']);
  });
});
