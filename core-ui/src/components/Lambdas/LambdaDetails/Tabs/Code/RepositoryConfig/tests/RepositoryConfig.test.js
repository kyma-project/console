import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';

import { gitLambdaMock } from 'components/Lambdas/helpers/testing';

import RepositoryConfig from '../RepositoryConfig';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { BUTTONS, REPOSITORY_CONFIG_PANEL } from 'components/Lambdas/constants';

describe('ResourceManagement', () => {
  const editText = REPOSITORY_CONFIG_PANEL.EDIT_BUTTON.TEXT;
  const saveText = REPOSITORY_CONFIG_PANEL.SAVE_BUTTON.TEXT;

  it('Render with minimal props', async () => {
    const { getByText } = render(<RepositoryConfig lambda={gitLambdaMock} />);

    const panel = REPOSITORY_CONFIG_PANEL;
    const array = [
      panel.TITLE,
      panel.INPUTS.REFERENCE.LABEL,
      panel.INPUTS.REFERENCE.INLINE_HELP,
      panel.INPUTS.BASE_DIR.LABEL,
      panel.INPUTS.BASE_DIR.INLINE_HELP,
    ];
    for (const item of array) {
      expect(getByText(item)).toBeInTheDocument();
    }
  });

  it('show Save and Cancel buttons after click Edit button', async () => {
    const { getByText } = render(<RepositoryConfig lambda={gitLambdaMock} />);

    const editButton = getByText(editText);
    expect(editButton).toBeInTheDocument();
    expect(editButton).not.toBeDisabled();
    fireEvent.click(editButton);

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).toBeDisabled();
      expect(saveButton).toBeInTheDocument();
      const cancelButton = getByText(BUTTONS.CANCEL);
      expect(cancelButton).not.toBeDisabled();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  it('show error after clear fields', async () => {
    const { getByText } = render(<RepositoryConfig lambda={gitLambdaMock} />);

    const editButton = getByText(editText);
    expect(editButton).toBeInTheDocument();
    expect(editButton).not.toBeDisabled();
    fireEvent.click(editButton);

    const reference = document.querySelector('#reference');
    const baseDir = document.querySelector('#baseDir');

    // valid
    fireEvent.input(reference, { target: { value: '' } });
    fireEvent.input(baseDir, { target: { value: '' } });

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).toBeDisabled();
      expect(
        getByText(REPOSITORY_CONFIG_PANEL.INPUTS.REFERENCE.ERRORS.EMPTY),
      ).toBeInTheDocument();
      expect(
        getByText(REPOSITORY_CONFIG_PANEL.INPUTS.BASE_DIR.ERRORS.EMPTY),
      ).toBeInTheDocument();
    });
  });
});
