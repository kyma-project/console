import React from 'react';
import renderer from 'react-test-renderer';

import * as mockData from './mockData';
import MultiChoiceList from '../MultiChoiceList.component';

describe('MultiChoiceList', () => {
  const originalConsoleError = console.error;
  afterEach(() => {
    console.error = originalConsoleError;
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
    expect(console.error.mock.calls.length).toBe(2);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Renders two lists of object items', () => {
    console.error = jest.fn();

    const component = renderer.create(
      <MultiChoiceList
        updateItems={() => {}}
        currentlySelectedItems={mockData.selectedObjects}
        currentlyNonSelectedItems={mockData.nonSelectedObjects}
        displayPropertySelector="name"
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();

    // catch "Warning: Each child in a list should have a unique \"key\" prop." comming from Fundamental
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });
});
