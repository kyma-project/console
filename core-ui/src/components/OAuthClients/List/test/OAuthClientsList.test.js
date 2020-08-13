import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientsList from '../OAuthClientsList';
import { MockedProvider } from '@apollo/react-testing';
import { namespace, clients, requestMocks } from './mocks';

describe('OAuthClientsList', () => {
  it('renders with minimal props', () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={requestMocks}>
        <OAuthClientsList namespace={namespace} />
      </MockedProvider>,
    );

    clients.forEach(async client => {
      expect(await findByText(client.name)).toBeInTheDocument();
      expect(await findByText(client.spec.secretName)).toBeInTheDocument();
    });
  });
});
