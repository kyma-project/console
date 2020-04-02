import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { validMock, errorMock } from './mock';
import { render, waitForDomChange, fireEvent } from '@testing-library/react';
import ConnectApplicationModal from '../ConnectApplicationModal';

jest.mock('index', () => ({ CompassGqlContext: {} }));

describe('ConnectApplicationModal', () => {
  it('opens modal', async () => {
    const { queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[validMock]}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    // modal should be initially closed
    expect(queryByLabelText('Connect Application')).not.toBeInTheDocument();

    console.time('t1');
    const modalOpeningComponent = queryByText('Connect');
    console.log('1 find connect');
    console.timeEnd('t1');
    expect(modalOpeningComponent).toBeInTheDocument();

    // open modal
    console.time('t1');
    fireEvent.click(modalOpeningComponent);
    console.log('1 click');
    console.timeEnd('t1');

    await waitForDomChange();

    // modal is opened
    expect(queryByLabelText('Connect Application')).toBeInTheDocument();
  }, 10000);

  it('loads connection data', async () => {
    const { getByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={[validMock]}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    console.time('t2');
    const p = getByText('Connect');
    console.log('2 get');
    console.timeEnd('t2');
    // open modal
    console.time('t2');
    fireEvent.click(p);
    console.log('2 click');
    console.timeEnd('t2');
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
  }, 10000);

  it('displays error on failure', async () => {
    // ignore error logged by component to console
    console.warn = () => {};

    const { getByText, queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[errorMock]}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    console.time('t3');
    const p = getByText('Connect');
    console.log('3 get');
    console.timeEnd('t3');
    // open modal
    console.time('t3');
    fireEvent.click(p);
    console.log('3 click');
    console.timeEnd('t3');
    await waitForDomChange();

    expect(queryByLabelText('Token')).not.toBeInTheDocument();
    expect(queryByLabelText('Connector URL')).not.toBeInTheDocument();

    const errorMessage = errorMock.error.message;
    expect(queryByText(new RegExp(errorMessage))).toBeInTheDocument();
  }, 10000);
});
