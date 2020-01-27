import React from 'react';
import { InputWithPrefix } from '../InputWithPrefix';

import 'core-js/es/array/flat-map';
import { render } from '@testing-library/react';

describe('InputWithPrefix', () => {
  it('Renders input with placeholder and prefix', () => {
    const props = {
      id: '123',
      prefix: 'example.com',
      placeholder: 'Enter the name',
      required: true,
      pattern: '^[a-zA-Z][a-zA-Z_-]*[a-zA-Z]$',
    };

    const { queryByText, queryAllByRole, queryByPlaceholderText } = render(
      <InputWithPrefix {...props} />,
    );

    expect(queryAllByRole('input')).toHaveLength(1);
    expect(queryByPlaceholderText(props.placeholder)).toBeInTheDocument();
    expect(queryByText(props.prefix)).toBeInTheDocument();
  });
});
