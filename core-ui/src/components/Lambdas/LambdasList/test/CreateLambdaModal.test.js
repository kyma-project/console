import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { LAMBDAS_LIST } from 'components/Lambdas/constants';

import CreateLambdaModal from '../CreateLambdaModal';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('CreateLambdaModal + CreateLambdaForm', () => {
  it('modal opening button should be disabled when error occurred from server', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={true} serverDataLoading={false} />,
    );

    const button = getByText(LAMBDAS_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('modal opening button should be disabled when data is fetching from server', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={true} />,
    );

    const button = getByText(LAMBDAS_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('modal opening button should be not disabled if data fetched correctly from server', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    const button = getByText(LAMBDAS_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should render modal after clicking open button', async () => {
    const { getByText, getByRole } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    const button = getByText(LAMBDAS_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT);
    fireEvent.click(button);

    expect(getByRole('dialog')).toBeInTheDocument();
  });
});
