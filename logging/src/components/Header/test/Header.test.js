import React from 'react';
import renderer from 'react-test-renderer';
import Header from './../Header';

describe('Header', () => {
  console.error = jest.fn();

  afterEach(() => {
    console.error.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
  });

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <Header
        updateFilteringState={() => {}}
        searchPhrase="search phrase"
        readonlyLabels={['a', 'b']}
        labels={['a', 'b']}
        sortDirection="ascending"
        advancedSettings={{}}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
