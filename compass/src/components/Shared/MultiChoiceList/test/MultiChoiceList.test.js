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
<<<<<<< HEAD
    console.error = jest.fn();

=======
>>>>>>> f0f2460c7570d3741e3ffad192726005cabd5615
    const component = renderer.create(
      <MultiChoiceList
        updateItems={() => {}}
        currentlySelectedItems={mockData.simpleSelected}
        currentlyNonSelectedItems={mockData.simpleNonselected}
      />,
    );

    expect(component.toJSON()).toMatchSnapshot();
<<<<<<< HEAD

    // catch "Warning: Each child in a list should have a unique \"key\" prop." comming from Fundamental
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
=======
>>>>>>> f0f2460c7570d3741e3ffad192726005cabd5615
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
});
