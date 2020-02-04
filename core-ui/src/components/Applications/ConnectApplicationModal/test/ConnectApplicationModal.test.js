import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { validMock, errorMock } from './mock';
import { render, waitForDomChange, fireEvent } from '@testing-library/react';
import ConnectApplicationModal from '../ConnectApplicationModal';
import { createMockLink } from 'react-shared';

jest.mock('index', () => ({ CompassGqlContext: {} }));

describe('ConnectApplicationModal', () => {
  it('opens modal', async () => {
    const { link } = createMockLink([validMock]);
    const { queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    // modal should be initially closed
    expect(queryByLabelText('Connect Application')).not.toBeInTheDocument();

    const modalOpeningComponent = queryByText('Connect');
    expect(modalOpeningComponent).toBeInTheDocument();

    // open modal
    fireEvent.click(modalOpeningComponent);

    await waitForDomChange();

    // modal is opened
    expect(queryByLabelText('Connect Application')).toBeInTheDocument();
  }, 5000);

  it('loads connection data', async () => {
    const { link } = createMockLink([validMock]);
    const { getByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} link={link}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    // open modal
    fireEvent.click(getByText('Connect'));
    await waitForDomChange();

    const {
      rawEncoded,
      legacyConnectorURL,
    } = validMock.result.data.requestOneTimeTokenForApplication;

    const rawEncodedInput = queryByLabelText(
      'Data to connect Application (base64 encoded)',
    );
    expect(rawEncodedInput).toBeInTheDocument();
    expect(rawEncodedInput).toHaveValue(rawEncoded);

    const connectorUrlInput = queryByLabelText('Legacy connector URL');
    expect(connectorUrlInput).toBeInTheDocument();
    expect(connectorUrlInput).toHaveValue(legacyConnectorURL);
  });

  fit('displays error on failure', async () => {
    // ignore error logged by component to console
    console.warn = () => {};

    const { link } = createMockLink([errorMock]);
    const { getByText, queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    // open modal
    fireEvent.click(getByText('Connect'));
    await waitForDomChange();

    expect(queryByLabelText('Token')).not.toBeInTheDocument();
    expect(queryByLabelText('Connector URL')).not.toBeInTheDocument();

    const errorMessage = errorMock.error.message;
    expect(queryByText(new RegExp(errorMessage))).toBeInTheDocument();
  });
});
