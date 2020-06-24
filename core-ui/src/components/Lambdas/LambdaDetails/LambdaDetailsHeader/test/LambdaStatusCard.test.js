import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { LAMBDA_DETAILS, LAMBDA_PHASES } from 'components/Lambdas/constants';

import LambdaStatusCard from '../LambdaStatusCard';

jest.mock('@luigi-project/client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('LambdaStatusCard', () => {
  it('should render status card with only title - Initializing phase', async () => {
    const { getByText } = render(
      <LambdaStatusCard
        lambdaName={lambdaMock.name}
        status={lambdaMock.status}
      />,
    );

    expect(getByText(LAMBDA_PHASES.INITIALIZING.TITLE)).toBeInTheDocument();
  });

  it('should render link for modal with error logs if status has error phase - Failed phase', async () => {
    const status = {
      phase: LAMBDA_PHASES.FAILED.TYPE,
      message: 'Error!',
    };

    const { getByText, getByRole } = render(
      <LambdaStatusCard lambdaName={lambdaMock.name} status={status} />,
    );

    const modalTitle = formatMessage(LAMBDA_DETAILS.STATUS.ERROR.MODAL.TITLE, {
      lambdaName: lambdaMock.name,
    });

    expect(getByText(LAMBDA_PHASES.FAILED.TITLE)).toBeInTheDocument();
    expect(getByText(LAMBDA_PHASES.FAILED.MESSAGE)).toBeInTheDocument();

    const link = document.querySelector('.link');
    fireEvent.click(link);

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByText(modalTitle)).toBeInTheDocument();
    expect(getByText('Error!')).toBeInTheDocument();
  });

  it('should render link for modal with error logs if status has error phase - NewRevisionError phase', async () => {
    const status = {
      phase: LAMBDA_PHASES.NEW_REVISION_ERROR.TYPE,
      message: 'Error!',
    };

    const { getByText, getByRole } = render(
      <LambdaStatusCard lambdaName={lambdaMock.name} status={status} />,
    );

    const modalTitle = formatMessage(LAMBDA_DETAILS.STATUS.ERROR.MODAL.TITLE, {
      lambdaName: lambdaMock.name,
    });

    expect(
      getByText(LAMBDA_PHASES.NEW_REVISION_ERROR.TITLE),
    ).toBeInTheDocument();
    expect(
      getByText(LAMBDA_PHASES.NEW_REVISION_ERROR.MESSAGE),
    ).toBeInTheDocument();

    const link = document.querySelector('.link');
    fireEvent.click(link);

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByText(modalTitle)).toBeInTheDocument();
    expect(getByText('Error!')).toBeInTheDocument();
  });
});
