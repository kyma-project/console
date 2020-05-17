import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import { CODE_AND_DEPENDENCIES_PANEL } from 'components/Lambdas/constants';

import CodeAndDependencies from '../CodeAndDependencies';

// This test cases don't test monaco-editor
// because under the hood monaco-editor use web-worker and it's difficult to load it on tests runtime
describe('CodeAndDependencies', () => {
  it('should render tabs with source and dependencies', async () => {
    const { queryByText } = render(<CodeAndDependencies lambda={lambdaMock} />);

    expect(
      queryByText(CODE_AND_DEPENDENCIES_PANEL.TABS.CODE),
    ).toBeInTheDocument();
    expect(
      queryByText(CODE_AND_DEPENDENCIES_PANEL.TABS.CODE),
    ).toBeInTheDocument();

    await wait(() => {
      const editors = document.querySelectorAll('.controlled-editor');
      expect(editors).toHaveLength(2);
    });
  });

  it('should not be able to save when the user has not made any changes', async () => {
    render(<CodeAndDependencies lambda={lambdaMock} />);

    const saveButton = document.querySelector('.sap-icon--save');
    expect(saveButton).toBeDisabled();
  });

  it('should render diff editors when user click diff toggle', async () => {
    render(<CodeAndDependencies lambda={lambdaMock} />);

    const toggle = document.querySelector('.fd-toggle__input');
    fireEvent.click(toggle);

    await wait(() => {
      const editors = document.querySelectorAll('.diff-editor');
      expect(editors).toHaveLength(2);
    });
  });
});
