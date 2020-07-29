import React from 'react';
import { render } from '@testing-library/react';
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
  it('Renders loading and valid state', async () => {
    const { queryByText, queryByLabelText, findByText } = render(
      <MockedProvider addTypename={false} mocks={[successMock]}>
        <OAuthClientSecret namespace={namespace} name={name} />
      </MockedProvider>,
    );

    expect(queryByText(`Secret ${name}`)).toBeInTheDocument();

    expect(queryByLabelText('Loading')).toBeInTheDocument();

    expect(await findByText(secret.data.client_id)).toBeInTheDocument();
    expect(await findByText(secret.data.client_secret)).toBeInTheDocument();
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
