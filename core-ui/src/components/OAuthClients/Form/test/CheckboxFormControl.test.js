import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CheckboxFormControl from '../CheckboxFormControl';

describe('CreateOAuthClient', () => {
  const availableValues = {
    a: 'A display name',
    b: 'B display name',
  };

  it('renders with minimal props', () => {
    const { queryByText } = render(
      <CheckboxFormControl
        name="Form Control Name"
        availableValues={availableValues}
        onChange={() => {}}
        values={['a']}
      />,
    );

    expect(queryByText(/Form Control Name/)).toBeInTheDocument();

    const aCheckbox = queryByText('A display name');
    expect(aCheckbox).toBeInTheDocument();
    expect(aCheckbox.firstChild).toBeChecked();

    const bCheckbox = queryByText('B display name');
    expect(bCheckbox).toBeInTheDocument();
    expect(bCheckbox.firstChild).not.toBeChecked();
  });

  it('callbacks on checkbox check', () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <CheckboxFormControl
        name="name"
        availableValues={availableValues}
        onChange={onChangeMock}
        values={['a']}
      />,
    );
    const aCheckbox = getByText('A display name');
    const bCheckbox = getByText('B display name');

    fireEvent.click(bCheckbox);
    expect(onChangeMock).toHaveBeenCalledWith(['a', 'b']);

    fireEvent.click(aCheckbox);
    expect(onChangeMock).toHaveBeenCalledWith(['b']);
  });
});
