import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { validMock } from './mock';
import { render, waitForDomChange, wait } from '@testing-library/react';
import ConnectApplicationModal from '../ConnectApplicationModal.container';

describe('ConnectApplicationModal Container', () => {
  const openModal = getByRoleFn => {
    const modalOpeningButton = getByRoleFn('button'); //get the only button around
    expect(modalOpeningButton.textContent).toBe('Connect Application'); // make sure this is the right one
    modalOpeningButton.click();
  };

  it('Modal is initially closed and opens after button click', async () => {
    const { queryByLabelText, getByRole, container } = render(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    expect(queryByLabelText('Connect Application')).not.toBeInTheDocument();
    openModal(getByRole);
    await waitForDomChange(container);

    await wait(() => {
      expect(queryByLabelText('Connect Application')).toBeInTheDocument();
    });
  });

  it('Modal handles "loading" state after open', () => {
    const { queryAllByRole, getByRole, container } = render(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    openModal(getByRole);

    const loadings = queryAllByRole('textbox');

    expect(loadings).toHaveLength(1);
    expect(loadings[0]).toHaveValue('Loading...');
  });

  it('Modal displays values got in response', async () => {
    const { getByLabelText, getByRole, container } = render(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    openModal(getByRole);
    await waitForDomChange(container);

    const {
      rawEncoded,
    } = validMock[0].result.data.requestOneTimeTokenForApplication;

    await wait(() => {
      expect(
        getByLabelText('Data to connect Application (base64 encoded)'),
      ).toHaveValue(rawEncoded);
    });
  });
});
