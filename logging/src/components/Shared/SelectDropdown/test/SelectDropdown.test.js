import React from 'react';
import {
  fireEvent,
  render,
  queryByText,
  getByText,
} from '@testing-library/react';
import SelectDropdown from './../SelectDropdown';

describe('SelectDropdown', () => {
  //Popover's Warning: `NaN` is an invalid value for the `left` css style property.
  console.error = jest.fn();

  it('Renders with minimal props', () => {
    const { getByRole } = render(
      <SelectDropdown
        currentValue={'option1'}
        availableValues={['option1', 'option2']}
        updateValue={() => {}}
      />,
    );

    fireEvent.click(getByRole('button'));

    const list = getByRole('list');
    expect(queryByText(list, 'option1')).toBeInTheDocument();
    expect(queryByText(list, 'option2')).toBeInTheDocument();
  });

  it('Fires event on choosing an option', () => {
    const mockUpdate = jest.fn();

    const { getByRole } = render(
      <SelectDropdown
        currentValue={'option1'}
        availableValues={['option1', 'option2']}
        updateValue={mockUpdate}
      />,
    );

    fireEvent.click(getByRole('button'));

    const option = getByText(getByRole('list'), 'option2');

    fireEvent.click(option);
    expect(mockUpdate).toHaveBeenCalledWith('option2');
  });
});
