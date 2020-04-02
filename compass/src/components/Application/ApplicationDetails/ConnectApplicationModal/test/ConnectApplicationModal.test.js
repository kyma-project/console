import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { validMock, errorMock } from './mock';
import { render, waitForDomChange } from '@testing-library/react';
import ConnectApplication from '../ConnectApplication';

describe('ConnectApplication', () => {
  it('loads connection data on render', async () => {
    const { queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplication applicationId="app-id" />
      </MockedProvider>,
    );

    // wait for data to load
    await waitForDomChange();

    const {
      rawEncoded,
      legacyConnectorURL,
    } = validMock[0].result.data.requestOneTimeTokenForApplication;

    const rawEncodedInput = queryByLabelText(
      'Data to connect Application (base64 encoded)',
    );
    expect(rawEncodedInput).toBeInTheDocument();
    expect(rawEncodedInput).toHaveValue(rawEncoded);

    const connectorUrlInput = queryByLabelText('Legacy connector URL');
    expect(connectorUrlInput).toBeInTheDocument();
    expect(connectorUrlInput).toHaveValue(legacyConnectorURL);
  });

  it('displays error on failure', async () => {
    // ignore error logged by component to console
    console.warn = () => {};

    const { queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={errorMock}>
        <ConnectApplication applicationId="app-id" />
      </MockedProvider>,
    );

    // wait for error to show
    await waitForDomChange();

    expect(queryByLabelText('Token')).not.toBeInTheDocument();
    expect(queryByLabelText('Connector URL')).not.toBeInTheDocument();

    const errorMessage = errorMock[0].error.message;
    expect(queryByText(new RegExp(errorMessage))).toBeInTheDocument();
  });
});
