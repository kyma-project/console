import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';

import SecretJson from '../SecretJson';

export const secretMock = {
  name: 'secretName',
  json: {
    key1: 'value1',
  },
};
// This test cases don't test monaco-editor
// because under the hood monaco-editor use web-worker and it's difficult to load it on tests runtime
describe('SecretJson', () => {
  it('should render editor', async () => {
    const { queryByText } = render(<SecretJson secret={secretMock} />);

    expect(queryByText('Source')).toBeInTheDocument();

    await wait(() => {
      const editors = document.querySelectorAll('.controlled-editor');
      expect(editors).toHaveLength(1);
    });
  });

  it('should not be able to save when source is empty', async () => {
    const { getByText } = render(
      <SecretJson secret={{ ...secretMock, json: {} }} />,
    );

    await wait(() => {
      const button = getByText('Save');
      expect(button).toBeDisabled();
    });
  });

  it('should not be able to save when there are no changes', async () => {
    const { getByText } = render(<SecretJson secret={secretMock} />);

    await wait(() => {
      const button = getByText('Save');
      expect(button).toBeDisabled();
    });
  });
});
