import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import { LAMBDAS_LIST } from 'components/Lambdas/constants';
import { repositoryMock } from 'components/Lambdas/helpers/testing';

import CreateLambdaModal from '../CreateLambdaModal';

jest.mock('@luigi-project/client', () => {
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

    button = getByText(createButton);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('Function name field', async () => {
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

    // empty name
    fireEvent.input(lambdaName, { target: { value: '' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.EMPTY;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // invalid name
    fireEvent.input(lambdaName, { target: { value: '9_invalid_' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.INVALID;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // duplicated name
    fireEvent.input(lambdaName, { target: { value: 'function' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.DUPLICATED;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // too long name
    fireEvent.input(lambdaName, {
      target: {
        value: Array(64)
          .fill('a')
          .join(''),
      },
    });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.ERRORS.TOO_LONG;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  }, 10000);

  it('No repositories case', async () => {
    const { getByText } = render(
      <CreateLambdaModal
        serverDataError={false}
        serverDataLoading={false}
        repositories={[]}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const sourceType = document.querySelector('#sourceType');
    fireEvent.change(sourceType, { target: { value: 'git' } });

    await wait(() => {
      const error = LAMBDAS_LIST.CREATE_MODAL.ERRORS.NO_REPOSITORY_FOUND;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  }, 10000);

  it('Reference and BaseDir fields', async () => {
    const { getByText } = render(
      <CreateLambdaModal
        serverDataError={false}
        serverDataLoading={false}
        repositories={[repositoryMock]}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const sourceType = document.querySelector('#sourceType');
    fireEvent.change(sourceType, { target: { value: 'git' } });

    await wait(() => {
      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    const reference = document.querySelector('#reference');
    const baseDir = document.querySelector('#baseDir');

    // valid
    fireEvent.input(reference, { target: { value: 'reference' } });
    fireEvent.input(baseDir, { target: { value: 'baseDir' } });

    await wait(() => {
      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    // invalid - empty
    fireEvent.input(reference, { target: { value: '' } });
    fireEvent.input(baseDir, { target: { value: '' } });

    await wait(() => {
      let error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.REFERENCE.ERRORS.EMPTY;
      expect(getByText(error)).toBeInTheDocument();

      error = LAMBDAS_LIST.CREATE_MODAL.INPUTS.BASE_DIR.ERRORS.EMPTY;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  }, 10000);
});
