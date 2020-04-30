import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';
import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

import EditLambdaLabelsModal from '../EditLambdaLabelsModal';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('EditLambdaLabelsModal + EditLambdaLabelsForm', () => {
  it('should render modal after clicking edit icon', async () => {
    const { getByText, getByRole } = render(
      <EditLambdaLabelsModal lambda={lambdaMock} />,
    );

    const editIcon = document.querySelector('.sap-icon--edit');
    fireEvent.click(editIcon);

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByText(LAMBDA_DETAILS.LABELS.EDIT_MODAL.TITLE),
    ).toBeInTheDocument();
  });
});
