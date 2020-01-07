import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { validMock } from './mock';
import { render, waitForDomChange } from '@testing-library/react';
import ConnectApplicationModal from '../ConnectApplicationModal.container';

describe('ConnectApplicationModal Container', () => {
  const openModal = async getByRoleFn => {
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
    await openModal(getByRole);
    await waitForDomChange(container);

    expect(queryByLabelText('Connect Application')).toBeInTheDocument();
  });

  it('Modal handles "loading" state after open', async () => {
    const { queryAllByRole, getByRole, container } = render(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    await openModal(getByRole);

    const loadings = queryAllByRole('textbox');
    expect(loadings).toHaveLength(2);

    expect(loadings[0]).toHaveValue('Loading...');
    expect(loadings[1]).toHaveValue('Loading...');

    await waitForDomChange(container);
  });

  it('Modal displays values got in response', async () => {
    const { getByLabelText, getByRole, container } = render(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    await openModal(getByRole);
    await waitForDomChange(container);

    const {
      token,
      connectorURL,
    } = validMock[0].result.data.requestOneTimeTokenForApplication;

    expect(getByLabelText('Token')).toHaveValue(token);
    expect(getByLabelText('Connector URL')).toHaveValue(connectorURL);
  });
});
