import React from 'react';
import renderer from 'react-test-renderer';
import SelectDropdown from './../SelectDropdown';

describe('SelectDropdown', () => {
  console.error = jest.fn();

  afterEach(() => {
    console.error.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
  });

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SelectDropdown
        currentValue={'a'}
        availabelValues={['a', 'b']}
        icon="connected"
        updateValue={() => {}}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
