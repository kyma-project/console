import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
  });

  it('allows for specifying secret name', () => {
    const { queryByText, getByText } = render(
      <MockedProvider addTypename={false} mocks={[secretsMock]}>
        <OAuthClientForm
          spec={spec}
          onChange={() => {}}
          namespace={namespace}
        />
      </MockedProvider>,
    );

    expect(queryByText(/Secret name/)).not.toBeInTheDocument();

    fireEvent.click(getByText('Define custom secret name for this client.'));
    expect(queryByText(/Secret name/)).toBeInTheDocument();

    fireEvent.click(getByText('Create secret with the same name as client.'));
    expect(queryByText('Secret name')).not.toBeInTheDocument();
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
  });
});
