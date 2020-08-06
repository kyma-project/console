import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OAuthClientSecret from '../OAuthClientSecret';
import { MockedProvider } from '@apollo/react-testing';

import {
  name,
  namespace,
  secret,
  successMock,
  errorMock,
  invalidSecretMock,
} from './mocks';

describe('OAuthClientSecret', () => {
  const expectEncodedState = async ({ findByText, queryByText }) => {
    expect(await findByText(btoa(secret.data.client_id))).toBeInTheDocument();
    expect(
      await findByText(btoa(secret.data.client_secret)),
    ).toBeInTheDocument();

    expect(queryByText(secret.data.client_id)).not.toBeInTheDocument();
    expect(queryByText(secret.data.client_secret)).not.toBeInTheDocument();
  };

  const expectDecodedState = async ({ findByText, queryByText }) => {
    expect(await findByText(secret.data.client_id)).toBeInTheDocument();
    expect(await findByText(secret.data.client_secret)).toBeInTheDocument();

    expect(queryByText(btoa(secret.data.client_id))).not.toBeInTheDocument();
    expect(
      queryByText(btoa(secret.data.client_secret)),
    ).not.toBeInTheDocument();
  };

  it('Renders loading and loaded state', async () => {
    const { queryByText, queryByLabelText, findByText } = render(
      <MockedProvider addTypename={false} mocks={[successMock]}>
        <OAuthClientSecret namespace={namespace} name={name} />
      </MockedProvider>,
    );

    expect(queryByText(`Secret ${name}`)).toBeInTheDocument();

    expect(queryByLabelText('Loading')).toBeInTheDocument();
    await expectEncodedState({ findByText, queryByText });
  });

  it('Decodes and encodes secret values', async () => {
    const { findByText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[successMock]}>
        <OAuthClientSecret namespace={namespace} name={name} />
      </MockedProvider>,
    );

    fireEvent.click(await findByText('Decode'));
    await expectDecodedState({ findByText, queryByText });

    fireEvent.click(await findByText('Hide decoded'));
    await expectEncodedState({ findByText, queryByText });
  });

  it('Renders error state', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[errorMock]}>
        <OAuthClientSecret namespace={namespace} name={name} />
      </MockedProvider>,
    );

    expect(
      await findByText('Error Network error: test-error'),
    ).toBeInTheDocument();
  });

  it('Renders invalid secret', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[invalidSecretMock]}>
        <OAuthClientSecret namespace={namespace} name={name} />
      </MockedProvider>,
    );

    expect(await findByText('Invalid secret.')).toBeInTheDocument();
  });
});
