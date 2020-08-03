import React from 'react';
import { render, fireEvent, act, wait } from '@testing-library/react';
import CreateOAuthClient from '../CreateOAuthClient';
import { MockedProvider } from '@apollo/react-testing';
import { requestMock, namespace, clientName, secretName } from './mocks';

describe('CreateOAuthClient', () => {
  it('displays form validation and creates client', async () => {
    const { getByLabelText, getByPlaceholderText, getByText } = render(
      <MockedProvider addTypename={false} mocks={[requestMock]}>
        <CreateOAuthClient namespace={namespace} />
      </MockedProvider>,
    );

    const submitButton = getByLabelText('submit-form');
    expect(submitButton).toBeDisabled();

    fireEvent.change(getByPlaceholderText('Client name'), {
      target: { value: clientName },
    });
    fireEvent.click(getByText('ID token'));
    fireEvent.click(getByText('Client credentials'));
    fireEvent.change(getByPlaceholderText('Secret name'), {
      target: { value: secretName },
    });

    expect(submitButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(submitButton);
      return await wait(() => expect(requestMock.result).toHaveBeenCalled());
    });
  });
});
