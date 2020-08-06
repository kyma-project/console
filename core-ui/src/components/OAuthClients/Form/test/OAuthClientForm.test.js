import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientForm from '../OAuthClientForm';
import { MockedProvider } from '@apollo/react-testing';
import { namespace, secretsMock } from './mocks';

describe('OAuthClientForm', () => {
  const spec = {
    grantTypes: ['client_credentials'],
    responseTypes: ['token'],
    scope: 'read write',
    secretName: '',
  };

  it('renders with minimal props', () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={[secretsMock]}>
        <OAuthClientForm
          spec={spec}
          onChange={() => {}}
          namespace={namespace}
        />
      </MockedProvider>,
    );

    expect(queryByText(/Response types/)).toBeInTheDocument();
    expect(queryByText(/Grant types/)).toBeInTheDocument();
    expect(queryByText(/Scope/)).toBeInTheDocument();
    expect(queryByText('Secret name')).toBeInTheDocument();
  });

  it('renders in create mode', () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={[secretsMock]}>
        <OAuthClientForm
          spec={spec}
          onChange={() => {}}
          namespace={namespace}
          isInCreateMode={true}
        />
      </MockedProvider>,
    );

    expect(queryByText(/Name/)).toBeInTheDocument();
    expect(queryByText(/Response types/)).toBeInTheDocument();
    expect(queryByText(/Grant types/)).toBeInTheDocument();
    expect(queryByText(/Scope/)).toBeInTheDocument();
    expect(queryByText('Secret name')).toBeInTheDocument();
  });
});
