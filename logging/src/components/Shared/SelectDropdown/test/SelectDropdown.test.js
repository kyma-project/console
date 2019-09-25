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
        availableValues={['a', 'b']}
        updateValue={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders with custom props', () => {
    const component = renderer.create(
      <SelectDropdown
        currentValue={'a'}
        availableValues={['a', 'b']}
        updateValue={() => {}}
        icon="connected"
        compact={true}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
