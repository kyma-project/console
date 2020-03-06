import React from 'react';
import { render } from '@testing-library/react';

import { lambda } from './mocks';
import ConfigurationForm from '../ConfigurationForm';

describe('Lambda Configuration Form', () => {
  const emptyRef = { current: null };
  const text = 'Label Editor Mock';
  const labelEditorMock = <p>{text}</p>;

  it('Render with minimal props', () => {
    const { getByText } = render(
      <ConfigurationForm
        lambda={lambda}
        sizeRef={emptyRef}
        runtimeRef={emptyRef}
        LabelsEditor={labelEditorMock}
        formRef={{ current: null }}
      />,
    );

    expect(getByText(text)).toBeInTheDocument();
  });
});
