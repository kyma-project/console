import React from 'react';
import { InputWithSuffix } from '../InputWithSuffix';

import 'core-js/es/array/flat-map';
import { render } from '@testing-library/react';

describe('InputWithSuffix', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation();

  it('Renders input with placeholder and suffix', () => {
    const props = {
      id: '123',
      suffix: 'example.com',
      placeholder: 'Enter the name',
      required: true,
      pattern: '^[a-zA-Z][a-zA-Z_-]*[a-zA-Z]$',
    };

    const { queryByText, queryAllByRole, queryByPlaceholderText } = render(
      <InputWithSuffix {...props} />,
    );

    expect(queryAllByRole('input')).toHaveLength(1);
    expect(queryByPlaceholderText(props.placeholder)).toBeTruthy();
    expect(queryByText(props.suffix)).toBeTruthy();

    expect(consoleError).not.toHaveBeenCalled();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
});
