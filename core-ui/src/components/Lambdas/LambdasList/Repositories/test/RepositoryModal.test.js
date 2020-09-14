import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import { repositoryMock } from 'components/Lambdas/helpers/testing';
import { REPOSITORIES_LIST } from 'components/Lambdas/constants';

import {
  CreateRepositoryModal,
  UpdateRepositoryModal,
} from '../RepositoryModal';

jest.mock('@luigi-project/client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('RepositoryModal + RepositoryForm', () => {
  const openButton = REPOSITORIES_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT;
  const createButton = REPOSITORIES_LIST.CREATE_MODAL.CONFIRM_BUTTON.TEXT;
  const updateButton = REPOSITORIES_LIST.UPDATE_MODAL.CONFIRM_BUTTON.TEXT;

  it('modal opening button should be disabled when error occurred from server', async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={true}
        serverDataLoading={false}
      />,
    );

    const button = getByText(openButton);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('modal opening button should be disabled when data is fetching from server', async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={true}
      />,
    );

    const button = getByText(openButton);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('modal opening button should be not disabled if data fetched correctly from server', async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
      />,
    );

    const button = getByText(openButton);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should render modal after clicking open button', async () => {
    const { getByText, getByRole } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
      />,
    );

    const button = getByText(openButton);
    fireEvent.click(button);

    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it("should show tooltip on modal's create button after clicking open button - empty Repository URL", async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    button = getByText(createButton);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('Repository name field', async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
        repositoryNames={['repository']}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const repositoryName = document.querySelector('#repositoryName');
    fireEvent.input(repositoryName, { target: { value: '' } });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.NAME.ERRORS.EMPTY;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    fireEvent.input(repositoryName, { target: { value: '9_invalid_' } });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.NAME.ERRORS.INVALID;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    fireEvent.input(repositoryName, { target: { value: 'repository' } });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.NAME.ERRORS.DUPLICATED;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    fireEvent.input(repositoryName, {
      target: {
        value: Array(64)
          .fill('a')
          .join(''),
      },
    });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.NAME.ERRORS.TOO_LONG;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  }, 10000);

  it('Repository URL field', async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);
    const repositoryUrl = document.querySelector('#repositoryUrl');

    // invalid
    fireEvent.input(repositoryUrl, { target: { value: 'test' } });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.URL.ERRORS.INVALID;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // empty
    fireEvent.input(repositoryUrl, { target: { value: '' } });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.URL.ERRORS.EMPTY;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // valid
    fireEvent.input(repositoryUrl, {
      target: { value: 'https://github.com/kyma-project/kyma.git' },
    });

    await wait(() => {
      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  }, 10000);

  it('Auth type and Secret name fields', async () => {
    const { getByText } = render(
      <CreateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
      />,
    );

    let button = getByText(openButton);
    fireEvent.click(button);

    const repositoryUrl = document.querySelector('#repositoryUrl');
    fireEvent.input(repositoryUrl, {
      target: { value: 'https://github.com/kyma-project/kyma.git' },
    });

    // change auth to basic - invalid
    const authType = document.querySelector('#authType');
    fireEvent.change(authType, { target: { value: 'basic' } });

    await wait(() => {
      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // change secretName to secretName - valid
    const secretName = document.querySelector('#secretName');
    fireEvent.input(secretName, { target: { value: 'secret-name' } });

    await wait(() => {
      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    // change secretName to empty value - invalid
    fireEvent.input(secretName, { target: { value: '' } });

    await wait(() => {
      const error = REPOSITORIES_LIST.MODAL_INPUTS.SECRET_NAME.ERRORS.EMPTY;
      expect(getByText(error)).toBeInTheDocument();

      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // change auth type to public - valid
    fireEvent.change(authType, { target: { value: '' } });

    await wait(() => {
      button = getByText(createButton);
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  }, 10000);

  it("should not show tooltip on modal's create button after clicking open button - update modal", async () => {
    const { container, getByText } = render(
      <UpdateRepositoryModal
        serverDataError={false}
        serverDataLoading={false}
        repository={repositoryMock}
      />,
    );

    let button = container.querySelector('button');
    fireEvent.click(button);

    button = getByText(updateButton);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
