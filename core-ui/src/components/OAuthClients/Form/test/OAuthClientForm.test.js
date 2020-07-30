import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientForm from '../OAuthClientForm';

describe('OAuthClientForm', () => {
  const spec = {
    grantTypes: ['client_credentials'],
    responseTypes: ['token'],
    scope: 'read write',
    secretName: 'secret-name',
  };

  it('renders with minimal props', () => {
    const { queryByText } = render(
      <OAuthClientForm spec={spec} onChange={() => {}} />,
    );

    expect(queryByText(/Response types/)).toBeInTheDocument();
    expect(queryByText(/Grant types/)).toBeInTheDocument();
    expect(queryByText(/Scope/)).toBeInTheDocument();
    expect(queryByText(/Secret name/)).toBeInTheDocument();
  });

  it('renders in create mode', () => {
    const { queryByText } = render(
      <OAuthClientForm spec={spec} onChange={() => {}} isCreate={true} />,
    );

    expect(queryByText(/Name/)).toBeInTheDocument();
    expect(queryByText(/Response types/)).toBeInTheDocument();
    expect(queryByText(/Grant types/)).toBeInTheDocument();
    expect(queryByText(/Scope/)).toBeInTheDocument();
    expect(queryByText(/Secret name/)).toBeInTheDocument();
  });
});
