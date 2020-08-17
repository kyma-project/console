import React from 'react';
import { render, fireEvent, act, wait } from '@testing-library/react';
import CreateOAuthClient from '../CreateOAuthClient';
import { MockedProvider } from '@apollo/react-testing';
import { requestMock, namespace, clientName, secretName } from './mocks';

describe('CreateOAuthClient', () => {
  const fillForm = ({ getByPlaceholderText, getByText }) => {
    fireEvent.change(getByPlaceholderText('Client name'), {
      target: { value: clientName },
    });
    fireEvent.click(getByText('ID token'));
    fireEvent.click(getByText('Client credentials'));
    fireEvent.click(getByText('Define custom secret name for this client.'));
    fireEvent.change(getByPlaceholderText('Secret name'), {
      target: { value: secretName },
    });
  };

  it('disables "Create" button when form data is invalid', async () => {
    const { findByLabelText } = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <CreateOAuthClient namespace={namespace} />
      </MockedProvider>,
    );

    expect(await findByLabelText('submit-form')).toBeDisabled();
  });

  it('enables "Create" button when form is filled', async () => {
    const { findByLabelText, getByPlaceholderText, getByText } = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <CreateOAuthClient namespace={namespace} />
      </MockedProvider>,
    );

    fillForm({ getByPlaceholderText, getByText });

    expect(await findByLabelText('submit-form')).not.toBeDisabled();
  });

  it('sends out a request on submit', async () => {
    const { findByLabelText, getByPlaceholderText, getByText } = render(
      <MockedProvider addTypename={false} mocks={[requestMock]}>
        <CreateOAuthClient namespace={namespace} />
      </MockedProvider>,
    );

    fillForm({ getByPlaceholderText, getByText });

    await act(async () => {
      fireEvent.click(await findByLabelText('submit-form'));
      return await wait(() => expect(requestMock.result).toHaveBeenCalled());
    });
  });
});
