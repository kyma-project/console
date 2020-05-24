import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

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
  const openButton = LAMBDAS_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT;
  const createButton = LAMBDAS_LIST.CREATE_MODAL.CONFIRM_BUTTON.TEXT;

  it('modal opening button should be disabled when error occurred from server', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={true} serverDataLoading={false} />,
    );

    const button = getByText(openButton);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('modal opening button should be disabled when data is fetching from server', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={true} />,
    );

    const button = getByText(openButton);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('modal opening button should be not disabled if data fetched correctly from server', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    const button = getByText(openButton);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should render modal after clicking open button', async () => {
    const { getByText, getByRole } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    const button = getByText(openButton);
    fireEvent.click(button);

    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it("should not show tooltip on modal's create button after clicking open button - valid random Function name", async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const errors = [
      LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.EMPTY,
      LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.INVALID,
      LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.DUPLICATED,
    ];
    for (const error of errors) {
      const tooltip = document.querySelector(
        `[data-original-title="${error}"]`,
      );
      expect(tooltip).not.toBeInTheDocument();
    }

    button = getByText(createButton);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should show name errors - empty Function name', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const lambdaName = document.querySelector('#lambdaName');
    fireEvent.input(lambdaName, { target: { value: '' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.EMPTY;
      const tooltip = document.querySelector(
        `[data-original-title="${error}"]`,
      );
      expect(tooltip).toBeInTheDocument();
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('should show name errors - invalid Function name', async () => {
    const { getByText } = render(
      <CreateLambdaModal serverDataError={false} serverDataLoading={false} />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const lambdaName = document.querySelector('#lambdaName');
    fireEvent.input(lambdaName, { target: { value: '9_invalid_' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.INVALID;
      const tooltip = document.querySelector(
        `[data-original-title="${error}"]`,
      );
      expect(tooltip).toBeInTheDocument();
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('should show name errors - duplicated Function name', async () => {
    const { getByText } = render(
      <CreateLambdaModal
        serverDataError={false}
        serverDataLoading={false}
        functionNames={['function']}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const lambdaName = document.querySelector('#lambdaName');
    fireEvent.input(lambdaName, { target: { value: 'function' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.DUPLICATED;
      const tooltip = document.querySelector(
        `[data-original-title="${error}"]`,
      );
      expect(tooltip).toBeInTheDocument();
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });
});
